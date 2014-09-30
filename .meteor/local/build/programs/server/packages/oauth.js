(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Log = Package.logging.Log;
var URL = Package.url.URL;

/* Package-scope variables */
var OAuth, OAuthTest, Oauth;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/oauth_server.js                                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var Fiber = Npm.require('fibers');                                                                // 1
var url = Npm.require('url');                                                                     // 2
                                                                                                  // 3
OAuth = {};                                                                                       // 4
OAuthTest = {};                                                                                   // 5
                                                                                                  // 6
RoutePolicy.declare('/_oauth/', 'network');                                                       // 7
                                                                                                  // 8
var registeredServices = {};                                                                      // 9
                                                                                                  // 10
// Internal: Maps from service version to handler function. The                                   // 11
// 'oauth1' and 'oauth2' packages manipulate this directly to register                            // 12
// for callbacks.                                                                                 // 13
OAuth._requestHandlers = {};                                                                      // 14
                                                                                                  // 15
                                                                                                  // 16
// Register a handler for an OAuth service. The handler will be called                            // 17
// when we get an incoming http request on /_oauth/{serviceName}. This                            // 18
// handler should use that information to fetch data about the user                               // 19
// logging in.                                                                                    // 20
//                                                                                                // 21
// @param name {String} e.g. "google", "facebook"                                                 // 22
// @param version {Number} OAuth version (1 or 2)                                                 // 23
// @param urls   For OAuth1 only, specify the service's urls                                      // 24
// @param handleOauthRequest {Function(oauthBinding|query)}                                       // 25
//   - (For OAuth1 only) oauthBinding {OAuth1Binding} bound to the appropriate provider           // 26
//   - (For OAuth2 only) query {Object} parameters passed in query string                         // 27
//   - return value is:                                                                           // 28
//     - {serviceData:, (optional options:)} where serviceData should end                         // 29
//       up in the user's services[name] field                                                    // 30
//     - `null` if the user declined to give permissions                                          // 31
//                                                                                                // 32
OAuth.registerService = function (name, version, urls, handleOauthRequest) {                      // 33
  if (registeredServices[name])                                                                   // 34
    throw new Error("Already registered the " + name + " OAuth service");                         // 35
                                                                                                  // 36
  registeredServices[name] = {                                                                    // 37
    serviceName: name,                                                                            // 38
    version: version,                                                                             // 39
    urls: urls,                                                                                   // 40
    handleOauthRequest: handleOauthRequest                                                        // 41
  };                                                                                              // 42
};                                                                                                // 43
                                                                                                  // 44
// For test cleanup.                                                                              // 45
OAuthTest.unregisterService = function (name) {                                                   // 46
  delete registeredServices[name];                                                                // 47
};                                                                                                // 48
                                                                                                  // 49
                                                                                                  // 50
OAuth.retrieveCredential = function(credentialToken, credentialSecret) {                          // 51
  return OAuth._retrievePendingCredential(credentialToken, credentialSecret);                     // 52
};                                                                                                // 53
                                                                                                  // 54
                                                                                                  // 55
// The state parameter is normally generated on the client using                                  // 56
// `btoa`, but for tests we need a version that runs on the server.                               // 57
//                                                                                                // 58
OAuth._generateState = function (loginStyle, credentialToken, redirectUrl) {                      // 59
  return new Buffer(JSON.stringify({                                                              // 60
    loginStyle: loginStyle,                                                                       // 61
    credentialToken: credentialToken,                                                             // 62
    redirectUrl: redirectUrl})).toString('base64');                                               // 63
};                                                                                                // 64
                                                                                                  // 65
OAuth._stateFromQuery = function (query) {                                                        // 66
  var string;                                                                                     // 67
  try {                                                                                           // 68
    string = new Buffer(query.state, 'base64').toString('binary');                                // 69
  } catch (e) {                                                                                   // 70
    Log.warn('Unable to base64 decode state from OAuth query: ' + query.state);                   // 71
    throw e;                                                                                      // 72
  }                                                                                               // 73
                                                                                                  // 74
  try {                                                                                           // 75
    return JSON.parse(string);                                                                    // 76
  } catch (e) {                                                                                   // 77
    Log.warn('Unable to parse state from OAuth query: ' + string);                                // 78
    throw e;                                                                                      // 79
  }                                                                                               // 80
};                                                                                                // 81
                                                                                                  // 82
OAuth._loginStyleFromQuery = function (query) {                                                   // 83
  var style;                                                                                      // 84
  // For backwards-compatibility for older clients, catch any errors                              // 85
  // that result from parsing the state parameter. If we can't parse it,                          // 86
  // set login style to popup by default.                                                         // 87
  try {                                                                                           // 88
    style = OAuth._stateFromQuery(query).loginStyle;                                              // 89
  } catch (err) {                                                                                 // 90
    style = "popup";                                                                              // 91
  }                                                                                               // 92
  if (style !== "popup" && style !== "redirect") {                                                // 93
    throw new Error("Unrecognized login style: " + style);                                        // 94
  }                                                                                               // 95
  return style;                                                                                   // 96
};                                                                                                // 97
                                                                                                  // 98
OAuth._credentialTokenFromQuery = function (query) {                                              // 99
  var state;                                                                                      // 100
  // For backwards-compatibility for older clients, catch any errors                              // 101
  // that result from parsing the state parameter. If we can't parse it,                          // 102
  // assume that the state parameter's value is the credential token, as                          // 103
  // it used to be for older clients.                                                             // 104
  try {                                                                                           // 105
    state = OAuth._stateFromQuery(query);                                                         // 106
  } catch (err) {                                                                                 // 107
    return query.state;                                                                           // 108
  }                                                                                               // 109
  return state.credentialToken;                                                                   // 110
};                                                                                                // 111
                                                                                                  // 112
OAuth._isCordovaFromQuery = function (query) {                                                    // 113
  try {                                                                                           // 114
    return !! OAuth._stateFromQuery(query).isCordova;                                             // 115
  } catch (err) {                                                                                 // 116
    // For backwards-compatibility for older clients, catch any errors                            // 117
    // that result from parsing the state parameter. If we can't parse                            // 118
    // it, assume that we are not on Cordova, since older Meteor didn't                           // 119
    // do Cordova.                                                                                // 120
    return false;                                                                                 // 121
  }                                                                                               // 122
};                                                                                                // 123
                                                                                                  // 124
                                                                                                  // 125
// Listen to incoming OAuth http requests                                                         // 126
WebApp.connectHandlers.use(function(req, res, next) {                                             // 127
  // Need to create a Fiber since we're using synchronous http calls and nothing                  // 128
  // else is wrapping this in a fiber automatically                                               // 129
  Fiber(function () {                                                                             // 130
    middleware(req, res, next);                                                                   // 131
  }).run();                                                                                       // 132
});                                                                                               // 133
                                                                                                  // 134
var middleware = function (req, res, next) {                                                      // 135
  // Make sure to catch any exceptions because otherwise we'd crash                               // 136
  // the runner                                                                                   // 137
  try {                                                                                           // 138
    var serviceName = oauthServiceName(req);                                                      // 139
    if (!serviceName) {                                                                           // 140
      // not an oauth request. pass to next middleware.                                           // 141
      next();                                                                                     // 142
      return;                                                                                     // 143
    }                                                                                             // 144
                                                                                                  // 145
    var service = registeredServices[serviceName];                                                // 146
                                                                                                  // 147
    // Skip everything if there's no service set by the oauth middleware                          // 148
    if (!service)                                                                                 // 149
      throw new Error("Unexpected OAuth service " + serviceName);                                 // 150
                                                                                                  // 151
    // Make sure we're configured                                                                 // 152
    ensureConfigured(serviceName);                                                                // 153
                                                                                                  // 154
    var handler = OAuth._requestHandlers[service.version];                                        // 155
    if (!handler)                                                                                 // 156
      throw new Error("Unexpected OAuth version " + service.version);                             // 157
    handler(service, req.query, res);                                                             // 158
  } catch (err) {                                                                                 // 159
    // if we got thrown an error, save it off, it will get passed to                              // 160
    // the appropriate login call (if any) and reported there.                                    // 161
    //                                                                                            // 162
    // The other option would be to display it in the popup tab that                              // 163
    // is still open at this point, ignoring the 'close' or 'redirect'                            // 164
    // we were passed. But then the developer wouldn't be able to                                 // 165
    // style the error or react to it in any way.                                                 // 166
    if (req.query.state && err instanceof Error) {                                                // 167
      try { // catch any exceptions to avoid crashing runner                                      // 168
        OAuth._storePendingCredential(OAuth._credentialTokenFromQuery(req.query), err);           // 169
      } catch (err) {                                                                             // 170
        // Ignore the error and just give up. If we failed to store the                           // 171
        // error, then the login will just fail with a generic error.                             // 172
        Log.warn("Error in OAuth Server while storing pending login result.\n" +                  // 173
                 err.stack || err.message);                                                       // 174
      }                                                                                           // 175
    }                                                                                             // 176
                                                                                                  // 177
    // close the popup. because nobody likes them just hanging                                    // 178
    // there.  when someone sees this multiple times they might                                   // 179
    // think to check server logs (we hope?)                                                      // 180
    // Catch errors because any exception here will crash the runner.                             // 181
    try {                                                                                         // 182
      OAuth._endOfLoginResponse(res, {                                                            // 183
        query: req.query,                                                                         // 184
        loginStyle: OAuth._loginStyleFromQuery(req.query),                                        // 185
        error: err                                                                                // 186
      });                                                                                         // 187
    } catch (err) {                                                                               // 188
      Log.warn("Error generating end of login response\n" +                                       // 189
               (err && (err.stack || err.message)));                                              // 190
    }                                                                                             // 191
  }                                                                                               // 192
};                                                                                                // 193
                                                                                                  // 194
OAuthTest.middleware = middleware;                                                                // 195
                                                                                                  // 196
// Handle /_oauth/* paths and extract the service name.                                           // 197
//                                                                                                // 198
// @returns {String|null} e.g. "facebook", or null if this isn't an                               // 199
// oauth request                                                                                  // 200
var oauthServiceName = function (req) {                                                           // 201
  // req.url will be "/_oauth/<service name>" with an optional "?close".                          // 202
  var i = req.url.indexOf('?');                                                                   // 203
  var barePath;                                                                                   // 204
  if (i === -1)                                                                                   // 205
    barePath = req.url;                                                                           // 206
  else                                                                                            // 207
    barePath = req.url.substring(0, i);                                                           // 208
  var splitPath = barePath.split('/');                                                            // 209
                                                                                                  // 210
  // Any non-oauth request will continue down the default                                         // 211
  // middlewares.                                                                                 // 212
  if (splitPath[1] !== '_oauth')                                                                  // 213
    return null;                                                                                  // 214
                                                                                                  // 215
  // Find service based on url                                                                    // 216
  var serviceName = splitPath[2];                                                                 // 217
  return serviceName;                                                                             // 218
};                                                                                                // 219
                                                                                                  // 220
// Make sure we're configured                                                                     // 221
var ensureConfigured = function(serviceName) {                                                    // 222
  if (!ServiceConfiguration.configurations.findOne({service: serviceName})) {                     // 223
    throw new ServiceConfiguration.ConfigError();                                                 // 224
  }                                                                                               // 225
};                                                                                                // 226
                                                                                                  // 227
var isSafe = function (value) {                                                                   // 228
  // This matches strings generated by `Random.secret` and                                        // 229
  // `Random.id`.                                                                                 // 230
  return typeof value === "string" &&                                                             // 231
    /^[a-zA-Z0-9\-_]+$/.test(value);                                                              // 232
};                                                                                                // 233
                                                                                                  // 234
// Internal: used by the oauth1 and oauth2 packages                                               // 235
OAuth._renderOauthResults = function(res, query, credentialSecret) {                              // 236
  // For tests, we support the `only_credential_secret_for_test`                                  // 237
  // parameter, which just returns the credential secret without any                              // 238
  // surrounding HTML. (The test needs to be able to easily grab the                              // 239
  // secret and use it to log in.)                                                                // 240
  //                                                                                              // 241
  // XXX only_credential_secret_for_test could be useful for other                                // 242
  // things beside tests, like command-line clients. We should give it a                          // 243
  // real name and serve the credential secret in JSON.                                           // 244
                                                                                                  // 245
  if (query.only_credential_secret_for_test) {                                                    // 246
    res.writeHead(200, {'Content-Type': 'text/html'});                                            // 247
    res.end(credentialSecret, 'utf-8');                                                           // 248
  } else {                                                                                        // 249
    var details = {                                                                               // 250
      query: query,                                                                               // 251
      loginStyle: OAuth._loginStyleFromQuery(query)                                               // 252
    };                                                                                            // 253
    if (query.error) {                                                                            // 254
      details.error = query.error;                                                                // 255
    } else {                                                                                      // 256
      var token = OAuth._credentialTokenFromQuery(query);                                         // 257
      var secret = credentialSecret;                                                              // 258
      if (token && secret &&                                                                      // 259
          isSafe(token) && isSafe(secret)) {                                                      // 260
        details.credentials = { token: token, secret: secret};                                    // 261
      } else {                                                                                    // 262
        details.error = "invalid_credential_token_or_secret";                                     // 263
      }                                                                                           // 264
    }                                                                                             // 265
                                                                                                  // 266
    OAuth._endOfLoginResponse(res, details);                                                      // 267
  }                                                                                               // 268
};                                                                                                // 269
                                                                                                  // 270
// This "template" (not a real Spacebars template, just an HTML file                              // 271
// with some ##PLACEHOLDER##s) communicates the credential secret back                            // 272
// to the main window and then closes the popup.                                                  // 273
OAuth._endOfPopupResponseTemplate = Assets.getText(                                               // 274
  "end_of_popup_response.html");                                                                  // 275
                                                                                                  // 276
var endOfRedirectResponseTemplate = Assets.getText(                                               // 277
  "end_of_redirect_response.html");                                                               // 278
                                                                                                  // 279
// Renders the end of login response template into some HTML and JavaScript                       // 280
// that closes the popup or redirects at the end of the OAuth flow.                               // 281
//                                                                                                // 282
// options are:                                                                                   // 283
//   - loginStyle ("popup" or "redirect")                                                         // 284
//   - setCredentialToken (boolean)                                                               // 285
//   - credentialToken                                                                            // 286
//   - credentialSecret                                                                           // 287
//   - redirectUrl                                                                                // 288
//   - isCordova (boolean)                                                                        // 289
//                                                                                                // 290
var renderEndOfLoginResponse = function (options) {                                               // 291
  // It would be nice to use Blaze here, but it's a little tricky                                 // 292
  // because our mustaches would be inside a <script> tag, and Blaze                              // 293
  // would treat the <script> tag contents as text (e.g. encode '&' as                            // 294
  // '&amp;'). So we just do a simple replace.                                                    // 295
                                                                                                  // 296
  var escape = function (s) {                                                                     // 297
    if (s) {                                                                                      // 298
      return s.replace(/&/g, "&amp;").                                                            // 299
        replace(/</g, "&lt;").                                                                    // 300
        replace(/>/g, "&gt;").                                                                    // 301
        replace(/\"/g, "&quot;").                                                                 // 302
        replace(/\'/g, "&#x27;").                                                                 // 303
        replace(/\//g, "&#x2F;");                                                                 // 304
    } else {                                                                                      // 305
      return s;                                                                                   // 306
    }                                                                                             // 307
  };                                                                                              // 308
                                                                                                  // 309
  // Escape everything just to be safe (we've already checked that some                           // 310
  // of this data -- the token and secret -- are safe).                                           // 311
  var config = {                                                                                  // 312
    setCredentialToken: !! options.setCredentialToken,                                            // 313
    credentialToken: escape(options.credentialToken),                                             // 314
    credentialSecret: escape(options.credentialSecret),                                           // 315
    storagePrefix: escape(OAuth._storageTokenPrefix),                                             // 316
    redirectUrl: escape(options.redirectUrl),                                                     // 317
    isCordova: !! options.isCordova                                                               // 318
  };                                                                                              // 319
                                                                                                  // 320
  var template;                                                                                   // 321
  if (options.loginStyle === 'popup') {                                                           // 322
    template = OAuth._endOfPopupResponseTemplate;                                                 // 323
  } else if (options.loginStyle === 'redirect') {                                                 // 324
    template = endOfRedirectResponseTemplate;                                                     // 325
  } else {                                                                                        // 326
    throw new Error('invalid loginStyle: ' + options.loginStyle);                                 // 327
  }                                                                                               // 328
                                                                                                  // 329
  var result = template.replace(/##CONFIG##/, JSON.stringify(config));                            // 330
                                                                                                  // 331
  return "<!DOCTYPE html>\n" + result;                                                            // 332
};                                                                                                // 333
                                                                                                  // 334
// Writes an HTTP response to the popup window at the end of an OAuth                             // 335
// login flow. At this point, if the user has successfully authenticated                          // 336
// to the OAuth server and authorized this app, we communicate the                                // 337
// credentialToken and credentialSecret to the main window. The main                              // 338
// window must provide both these values to the DDP `login` method to                             // 339
// authenticate its DDP connection. After communicating these vaues to                            // 340
// the main window, we close the popup.                                                           // 341
//                                                                                                // 342
// We export this function so that developers can override this                                   // 343
// behavior, which is particularly useful in, for example, some mobile                            // 344
// environments where popups and/or `window.opener` don't work. For                               // 345
// example, an app could override `OAuth._endOfPopupResponse` to put the                          // 346
// credential token and credential secret in the popup URL for the main                           // 347
// window to read them there instead of using `window.opener`. If you                             // 348
// override this function, you take responsibility for writing to the                             // 349
// request and calling `res.end()` to complete the request.                                       // 350
//                                                                                                // 351
// Arguments:                                                                                     // 352
//   - res: the HTTP response object                                                              // 353
//   - details:                                                                                   // 354
//      - query: the query string on the HTTP request                                             // 355
//      - credentials: { token: *, secret: * }. If present, this field                            // 356
//        indicates that the login was successful. Return these values                            // 357
//        to the client, who can use them to log in over DDP. If                                  // 358
//        present, the values have been checked against a limited                                 // 359
//        character set and are safe to include in HTML.                                          // 360
//      - error: if present, a string or Error indicating an error that                           // 361
//        occurred during the login. This can come from the client and                            // 362
//        so shouldn't be trusted for security decisions or included in                           // 363
//        the response without sanitizing it first. Only one of `error`                           // 364
//        or `credentials` should be set.                                                         // 365
OAuth._endOfLoginResponse = function (res, details) {                                             // 366
  res.writeHead(200, {'Content-Type': 'text/html'});                                              // 367
                                                                                                  // 368
  var redirectUrl;                                                                                // 369
  if (details.loginStyle === 'redirect') {                                                        // 370
    redirectUrl = OAuth._stateFromQuery(details.query).redirectUrl;                               // 371
    var appHost = Meteor.absoluteUrl();                                                           // 372
    var appHostReplacedLocalhost = Meteor.absoluteUrl(undefined, {                                // 373
      replaceLocalhost: true                                                                      // 374
    });                                                                                           // 375
    if (redirectUrl.substr(0, appHost.length) !== appHost &&                                      // 376
        redirectUrl.substr(0, appHostReplacedLocalhost.length) !==                                // 377
        appHostReplacedLocalhost) {                                                               // 378
      details.error = "redirectUrl (" + redirectUrl +                                             // 379
        ") is not on the same host as the app (" + appHost + ")";                                 // 380
      redirectUrl = appHost;                                                                      // 381
    }                                                                                             // 382
  }                                                                                               // 383
                                                                                                  // 384
  var isCordova = OAuth._isCordovaFromQuery(details.query);                                       // 385
                                                                                                  // 386
  if (details.error) {                                                                            // 387
    Log.warn("Error in OAuth Server: " +                                                          // 388
             (details.error instanceof Error ?                                                    // 389
              details.error.message : details.error));                                            // 390
    res.end(renderEndOfLoginResponse({                                                            // 391
      loginStyle: details.loginStyle,                                                             // 392
      setCredentialToken: false,                                                                  // 393
      redirectUrl: redirectUrl,                                                                   // 394
      isCordova: isCordova                                                                        // 395
    }), "utf-8");                                                                                 // 396
    return;                                                                                       // 397
  }                                                                                               // 398
                                                                                                  // 399
  // If we have a credentialSecret, report it back to the parent                                  // 400
  // window, with the corresponding credentialToken. The parent window                            // 401
  // uses the credentialToken and credentialSecret to log in over DDP.                            // 402
  res.end(renderEndOfLoginResponse({                                                              // 403
    loginStyle: details.loginStyle,                                                               // 404
    setCredentialToken: true,                                                                     // 405
    credentialToken: details.credentials.token,                                                   // 406
    credentialSecret: details.credentials.secret,                                                 // 407
    redirectUrl: redirectUrl,                                                                     // 408
    isCordova: isCordova                                                                          // 409
  }), "utf-8");                                                                                   // 410
};                                                                                                // 411
                                                                                                  // 412
                                                                                                  // 413
var OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption; // 414
                                                                                                  // 415
var usingOAuthEncryption = function () {                                                          // 416
  return OAuthEncryption && OAuthEncryption.keyIsLoaded();                                        // 417
};                                                                                                // 418
                                                                                                  // 419
// Encrypt sensitive service data such as access tokens if the                                    // 420
// "oauth-encryption" package is loaded and the oauth secret key has                              // 421
// been specified.  Returns the unencrypted plaintext otherwise.                                  // 422
//                                                                                                // 423
// The user id is not specified because the user isn't known yet at                               // 424
// this point in the oauth authentication process.  After the oauth                               // 425
// authentication process completes the encrypted service data fields                             // 426
// will be re-encrypted with the user id included before inserting the                            // 427
// service data into the user document.                                                           // 428
//                                                                                                // 429
OAuth.sealSecret = function (plaintext) {                                                         // 430
  if (usingOAuthEncryption())                                                                     // 431
    return OAuthEncryption.seal(plaintext);                                                       // 432
  else                                                                                            // 433
    return plaintext;                                                                             // 434
}                                                                                                 // 435
                                                                                                  // 436
// Unencrypt a service data field, if the "oauth-encryption"                                      // 437
// package is loaded and the field is encrypted.                                                  // 438
//                                                                                                // 439
// Throws an error if the "oauth-encryption" package is loaded and the                            // 440
// field is encrypted, but the oauth secret key hasn't been specified.                            // 441
//                                                                                                // 442
OAuth.openSecret = function (maybeSecret, userId) {                                               // 443
  if (!Package["oauth-encryption"] || !OAuthEncryption.isSealed(maybeSecret))                     // 444
    return maybeSecret;                                                                           // 445
                                                                                                  // 446
  return OAuthEncryption.open(maybeSecret, userId);                                               // 447
};                                                                                                // 448
                                                                                                  // 449
// Unencrypt fields in the service data object.                                                   // 450
//                                                                                                // 451
OAuth.openSecrets = function (serviceData, userId) {                                              // 452
  var result = {};                                                                                // 453
  _.each(_.keys(serviceData), function (key) {                                                    // 454
    result[key] = OAuth.openSecret(serviceData[key], userId);                                     // 455
  });                                                                                             // 456
  return result;                                                                                  // 457
};                                                                                                // 458
                                                                                                  // 459
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/pending_credentials.js                                                          //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
//                                                                                                // 1
// When an oauth request is made, Meteor receives oauth credentials                               // 2
// in one browser tab, and temporarily persists them while that                                   // 3
// tab is closed, then retrieves them in the browser tab that                                     // 4
// initiated the credential request.                                                              // 5
//                                                                                                // 6
// _pendingCredentials is the storage mechanism used to share the                                 // 7
// credential between the 2 tabs                                                                  // 8
//                                                                                                // 9
                                                                                                  // 10
                                                                                                  // 11
// Collection containing pending credentials of oauth credential requests                         // 12
// Has key, credential, and createdAt fields.                                                     // 13
OAuth._pendingCredentials = new Mongo.Collection(                                                 // 14
  "meteor_oauth_pendingCredentials", {                                                            // 15
    _preventAutopublish: true                                                                     // 16
  });                                                                                             // 17
                                                                                                  // 18
OAuth._pendingCredentials._ensureIndex('key', {unique: 1});                                       // 19
OAuth._pendingCredentials._ensureIndex('credentialSecret');                                       // 20
OAuth._pendingCredentials._ensureIndex('createdAt');                                              // 21
                                                                                                  // 22
                                                                                                  // 23
                                                                                                  // 24
// Periodically clear old entries that were never retrieved                                       // 25
var _cleanStaleResults = function() {                                                             // 26
  // Remove credentials older than 1 minute                                                       // 27
  var timeCutoff = new Date();                                                                    // 28
  timeCutoff.setMinutes(timeCutoff.getMinutes() - 1);                                             // 29
  OAuth._pendingCredentials.remove({ createdAt: { $lt: timeCutoff } });                           // 30
};                                                                                                // 31
var _cleanupHandle = Meteor.setInterval(_cleanStaleResults, 60 * 1000);                           // 32
                                                                                                  // 33
                                                                                                  // 34
// Stores the key and credential in the _pendingCredentials collection.                           // 35
// Will throw an exception if `key` is not a string.                                              // 36
//                                                                                                // 37
// @param key {string}                                                                            // 38
// @param credential {Object}   The credential to store                                           // 39
// @param credentialSecret {string} A secret that must be presented in                            // 40
//   addition to the `key` to retrieve the credential                                             // 41
//                                                                                                // 42
OAuth._storePendingCredential = function (key, credential, credentialSecret) {                    // 43
  check(key, String);                                                                             // 44
  check(credentialSecret, Match.Optional(String));                                                // 45
                                                                                                  // 46
  if (credential instanceof Error) {                                                              // 47
    credential = storableError(credential);                                                       // 48
  } else {                                                                                        // 49
    credential = OAuth.sealSecret(credential);                                                    // 50
  }                                                                                               // 51
                                                                                                  // 52
  // We do an upsert here instead of an insert in case the user happens                           // 53
  // to somehow send the same `state` parameter twice during an OAuth                             // 54
  // login; we don't want a duplicate key error.                                                  // 55
  OAuth._pendingCredentials.upsert({                                                              // 56
    key: key                                                                                      // 57
  }, {                                                                                            // 58
    key: key,                                                                                     // 59
    credential: credential,                                                                       // 60
    credentialSecret: credentialSecret || null,                                                   // 61
    createdAt: new Date()                                                                         // 62
  });                                                                                             // 63
};                                                                                                // 64
                                                                                                  // 65
                                                                                                  // 66
// Retrieves and removes a credential from the _pendingCredentials collection                     // 67
//                                                                                                // 68
// @param key {string}                                                                            // 69
// @param credentialSecret {string}                                                               // 70
//                                                                                                // 71
OAuth._retrievePendingCredential = function (key, credentialSecret) {                             // 72
  check(key, String);                                                                             // 73
                                                                                                  // 74
  var pendingCredential = OAuth._pendingCredentials.findOne({                                     // 75
    key: key,                                                                                     // 76
    credentialSecret: credentialSecret || null                                                    // 77
  });                                                                                             // 78
  if (pendingCredential) {                                                                        // 79
    OAuth._pendingCredentials.remove({ _id: pendingCredential._id });                             // 80
    if (pendingCredential.credential.error)                                                       // 81
      return recreateError(pendingCredential.credential.error);                                   // 82
    else                                                                                          // 83
      return OAuth.openSecret(pendingCredential.credential);                                      // 84
  } else {                                                                                        // 85
    return undefined;                                                                             // 86
  }                                                                                               // 87
};                                                                                                // 88
                                                                                                  // 89
                                                                                                  // 90
// Convert an Error into an object that can be stored in mongo                                    // 91
// Note: A Meteor.Error is reconstructed as a Meteor.Error                                        // 92
// All other error classes are reconstructed as a plain Error.                                    // 93
var storableError = function(error) {                                                             // 94
  var plainObject = {};                                                                           // 95
  Object.getOwnPropertyNames(error).forEach(function(key) {                                       // 96
    plainObject[key] = error[key];                                                                // 97
  });                                                                                             // 98
                                                                                                  // 99
  // Keep track of whether it's a Meteor.Error                                                    // 100
  if(error instanceof Meteor.Error) {                                                             // 101
    plainObject['meteorError'] = true;                                                            // 102
  }                                                                                               // 103
                                                                                                  // 104
  return { error: plainObject };                                                                  // 105
};                                                                                                // 106
                                                                                                  // 107
// Create an error from the error format stored in mongo                                          // 108
var recreateError = function(errorDoc) {                                                          // 109
  var error;                                                                                      // 110
                                                                                                  // 111
  if (errorDoc.meteorError) {                                                                     // 112
    error = new Meteor.Error();                                                                   // 113
    delete errorDoc.meteorError;                                                                  // 114
  } else {                                                                                        // 115
    error = new Error();                                                                          // 116
  }                                                                                               // 117
                                                                                                  // 118
  Object.getOwnPropertyNames(errorDoc).forEach(function(key) {                                    // 119
    error[key] = errorDoc[key];                                                                   // 120
  });                                                                                             // 121
                                                                                                  // 122
  return error;                                                                                   // 123
};                                                                                                // 124
                                                                                                  // 125
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/oauth_common.js                                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
OAuth._storageTokenPrefix = "Meteor.oauth.credentialSecret-";                                     // 1
                                                                                                  // 2
OAuth._redirectUri = function (serviceName, config, params, absoluteUrlOptions) {                 // 3
  // XXX COMPAT WITH 0.9.0                                                                        // 4
  // The redirect URI used to have a "?close" query argument.  We                                 // 5
  // detect whether we need to be backwards compatible by checking for                            // 6
  // the absence of the `loginStyle` field, which wasn't used in the                              // 7
  // code which had the "?close" argument.                                                        // 8
  var query = config.loginStyle ? null : "close";                                                 // 9
                                                                                                  // 10
  return URL._constructUrl(                                                                       // 11
    Meteor.absoluteUrl('_oauth/' + serviceName, absoluteUrlOptions),                              // 12
    query,                                                                                        // 13
    params);                                                                                      // 14
};                                                                                                // 15
                                                                                                  // 16
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/oauth/deprecated.js                                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
// XXX COMPAT WITH 0.8.0                                                                          // 1
                                                                                                  // 2
Oauth = OAuth;                                                                                    // 3
                                                                                                  // 4
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.oauth = {
  OAuth: OAuth,
  OAuthTest: OAuthTest,
  Oauth: Oauth
};

})();
