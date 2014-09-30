(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Boilerplate = Package['boilerplate-generator'].Boilerplate;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;

/* Package-scope variables */
var WebApp, main, WebAppInternals;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/webapp/webapp_server.js                                                      //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
////////// Requires //////////                                                           // 1
                                                                                         // 2
var fs = Npm.require("fs");                                                              // 3
var http = Npm.require("http");                                                          // 4
var os = Npm.require("os");                                                              // 5
var path = Npm.require("path");                                                          // 6
var url = Npm.require("url");                                                            // 7
var crypto = Npm.require("crypto");                                                      // 8
                                                                                         // 9
var connect = Npm.require('connect');                                                    // 10
var useragent = Npm.require('useragent');                                                // 11
var send = Npm.require('send');                                                          // 12
                                                                                         // 13
var Future = Npm.require('fibers/future');                                               // 14
var Fiber = Npm.require('fibers');                                                       // 15
                                                                                         // 16
var SHORT_SOCKET_TIMEOUT = 5*1000;                                                       // 17
var LONG_SOCKET_TIMEOUT = 120*1000;                                                      // 18
                                                                                         // 19
WebApp = {};                                                                             // 20
WebAppInternals = {};                                                                    // 21
                                                                                         // 22
WebApp.defaultArch = 'web.browser';                                                      // 23
                                                                                         // 24
// XXX maps archs to manifests                                                           // 25
WebApp.clientPrograms = {};                                                              // 26
                                                                                         // 27
// XXX maps archs to program path on filesystem                                          // 28
var archPath = {};                                                                       // 29
                                                                                         // 30
var bundledJsCssPrefix;                                                                  // 31
                                                                                         // 32
// Keepalives so that when the outer server dies unceremoniously and                     // 33
// doesn't kill us, we quit ourselves. A little gross, but better than                   // 34
// pidfiles.                                                                             // 35
// XXX This should really be part of the boot script, not the webapp package.            // 36
//     Or we should just get rid of it, and rely on containerization.                    // 37
                                                                                         // 38
var initKeepalive = function () {                                                        // 39
  var keepaliveCount = 0;                                                                // 40
                                                                                         // 41
  process.stdin.on('data', function (data) {                                             // 42
    keepaliveCount = 0;                                                                  // 43
  });                                                                                    // 44
                                                                                         // 45
  process.stdin.resume();                                                                // 46
                                                                                         // 47
  setInterval(function () {                                                              // 48
    keepaliveCount ++;                                                                   // 49
    if (keepaliveCount >= 3) {                                                           // 50
      console.log("Failed to receive keepalive! Exiting.");                              // 51
      process.exit(1);                                                                   // 52
    }                                                                                    // 53
  }, 3000);                                                                              // 54
};                                                                                       // 55
                                                                                         // 56
                                                                                         // 57
var sha1 = function (contents) {                                                         // 58
  var hash = crypto.createHash('sha1');                                                  // 59
  hash.update(contents);                                                                 // 60
  return hash.digest('hex');                                                             // 61
};                                                                                       // 62
                                                                                         // 63
var readUtf8FileSync = function (filename) {                                             // 64
  return Future.wrap(fs.readFile)(filename, 'utf8').wait();                              // 65
};                                                                                       // 66
                                                                                         // 67
// #BrowserIdentification                                                                // 68
//                                                                                       // 69
// We have multiple places that want to identify the browser: the                        // 70
// unsupported browser page, the appcache package, and, eventually                       // 71
// delivering browser polyfills only as needed.                                          // 72
//                                                                                       // 73
// To avoid detecting the browser in multiple places ad-hoc, we create a                 // 74
// Meteor "browser" object. It uses but does not expose the npm                          // 75
// useragent module (we could choose a different mechanism to identify                   // 76
// the browser in the future if we wanted to).  The browser object                       // 77
// contains                                                                              // 78
//                                                                                       // 79
// * `name`: the name of the browser in camel case                                       // 80
// * `major`, `minor`, `patch`: integers describing the browser version                  // 81
//                                                                                       // 82
// Also here is an early version of a Meteor `request` object, intended                  // 83
// to be a high-level description of the request without exposing                        // 84
// details of connect's low-level `req`.  Currently it contains:                         // 85
//                                                                                       // 86
// * `browser`: browser identification object described above                            // 87
// * `url`: parsed url, including parsed query params                                    // 88
//                                                                                       // 89
// As a temporary hack there is a `categorizeRequest` function on WebApp which           // 90
// converts a connect `req` to a Meteor `request`. This can go away once smart           // 91
// packages such as appcache are being passed a `request` object directly when           // 92
// they serve content.                                                                   // 93
//                                                                                       // 94
// This allows `request` to be used uniformly: it is passed to the html                  // 95
// attributes hook, and the appcache package can use it when deciding                    // 96
// whether to generate a 404 for the manifest.                                           // 97
//                                                                                       // 98
// Real routing / server side rendering will probably refactor this                      // 99
// heavily.                                                                              // 100
                                                                                         // 101
                                                                                         // 102
// e.g. "Mobile Safari" => "mobileSafari"                                                // 103
var camelCase = function (name) {                                                        // 104
  var parts = name.split(' ');                                                           // 105
  parts[0] = parts[0].toLowerCase();                                                     // 106
  for (var i = 1;  i < parts.length;  ++i) {                                             // 107
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);                    // 108
  }                                                                                      // 109
  return parts.join('');                                                                 // 110
};                                                                                       // 111
                                                                                         // 112
var identifyBrowser = function (userAgentString) {                                       // 113
  var userAgent = useragent.lookup(userAgentString);                                     // 114
  return {                                                                               // 115
    name: camelCase(userAgent.family),                                                   // 116
    major: +userAgent.major,                                                             // 117
    minor: +userAgent.minor,                                                             // 118
    patch: +userAgent.patch                                                              // 119
  };                                                                                     // 120
};                                                                                       // 121
                                                                                         // 122
// XXX Refactor as part of implementing real routing.                                    // 123
WebAppInternals.identifyBrowser = identifyBrowser;                                       // 124
                                                                                         // 125
WebApp.categorizeRequest = function (req) {                                              // 126
  return {                                                                               // 127
    browser: identifyBrowser(req.headers['user-agent']),                                 // 128
    url: url.parse(req.url, true)                                                        // 129
  };                                                                                     // 130
};                                                                                       // 131
                                                                                         // 132
// HTML attribute hooks: functions to be called to determine any attributes to           // 133
// be added to the '<html>' tag. Each function is passed a 'request' object (see         // 134
// #BrowserIdentification) and should return a string,                                   // 135
var htmlAttributeHooks = [];                                                             // 136
var getHtmlAttributes = function (request) {                                             // 137
  var combinedAttributes  = {};                                                          // 138
  _.each(htmlAttributeHooks || [], function (hook) {                                     // 139
    var attributes = hook(request);                                                      // 140
    if (attributes === null)                                                             // 141
      return;                                                                            // 142
    if (typeof attributes !== 'object')                                                  // 143
      throw Error("HTML attribute hook must return null or object");                     // 144
    _.extend(combinedAttributes, attributes);                                            // 145
  });                                                                                    // 146
  return combinedAttributes;                                                             // 147
};                                                                                       // 148
WebApp.addHtmlAttributeHook = function (hook) {                                          // 149
  htmlAttributeHooks.push(hook);                                                         // 150
};                                                                                       // 151
                                                                                         // 152
// Serve app HTML for this URL?                                                          // 153
var appUrl = function (url) {                                                            // 154
  if (url === '/favicon.ico' || url === '/robots.txt')                                   // 155
    return false;                                                                        // 156
                                                                                         // 157
  // NOTE: app.manifest is not a web standard like favicon.ico and                       // 158
  // robots.txt. It is a file name we have chosen to use for HTML5                       // 159
  // appcache URLs. It is included here to prevent using an appcache                     // 160
  // then removing it from poisoning an app permanently. Eventually,                     // 161
  // once we have server side routing, this won't be needed as                           // 162
  // unknown URLs with return a 404 automatically.                                       // 163
  if (url === '/app.manifest')                                                           // 164
    return false;                                                                        // 165
                                                                                         // 166
  // Avoid serving app HTML for declared routes such as /sockjs/.                        // 167
  if (RoutePolicy.classify(url))                                                         // 168
    return false;                                                                        // 169
                                                                                         // 170
  // we currently return app HTML on all URLs by default                                 // 171
  return true;                                                                           // 172
};                                                                                       // 173
                                                                                         // 174
                                                                                         // 175
// We need to calculate the client hash after all packages have loaded                   // 176
// to give them a chance to populate __meteor_runtime_config__.                          // 177
//                                                                                       // 178
// Calculating the hash during startup means that packages can only                      // 179
// populate __meteor_runtime_config__ during load, not during startup.                   // 180
//                                                                                       // 181
// Calculating instead it at the beginning of main after all startup                     // 182
// hooks had run would allow packages to also populate                                   // 183
// __meteor_runtime_config__ during startup, but that's too late for                     // 184
// autoupdate because it needs to have the client hash at startup to                     // 185
// insert the auto update version itself into                                            // 186
// __meteor_runtime_config__ to get it to the client.                                    // 187
//                                                                                       // 188
// An alternative would be to give autoupdate a "post-start,                             // 189
// pre-listen" hook to allow it to insert the auto update version at                     // 190
// the right moment.                                                                     // 191
                                                                                         // 192
Meteor.startup(function () {                                                             // 193
  var calculateClientHash = WebAppHashing.calculateClientHash;                           // 194
  WebApp.clientHash = function (archName) {                                              // 195
    archName = archName || WebApp.defaultArch;                                           // 196
    return calculateClientHash(WebApp.clientPrograms[archName].manifest);                // 197
  };                                                                                     // 198
                                                                                         // 199
  WebApp.calculateClientHashRefreshable = function (archName) {                          // 200
    archName = archName || WebApp.defaultArch;                                           // 201
    return calculateClientHash(WebApp.clientPrograms[archName].manifest,                 // 202
      function (name) {                                                                  // 203
        return name === "css";                                                           // 204
      });                                                                                // 205
  };                                                                                     // 206
  WebApp.calculateClientHashNonRefreshable = function (archName) {                       // 207
    archName = archName || WebApp.defaultArch;                                           // 208
    return calculateClientHash(WebApp.clientPrograms[archName].manifest,                 // 209
      function (name) {                                                                  // 210
        return name !== "css";                                                           // 211
      });                                                                                // 212
  };                                                                                     // 213
  WebApp.calculateClientHashCordova = function () {                                      // 214
    var archName = 'web.cordova';                                                        // 215
    if (! WebApp.clientPrograms[archName])                                               // 216
      return 'none';                                                                     // 217
                                                                                         // 218
    return calculateClientHash(                                                          // 219
      WebApp.clientPrograms[archName].manifest, null, _.pick(                            // 220
        __meteor_runtime_config__, 'PUBLIC_SETTINGS'));                                  // 221
  };                                                                                     // 222
});                                                                                      // 223
                                                                                         // 224
                                                                                         // 225
                                                                                         // 226
// When we have a request pending, we want the socket timeout to be long, to             // 227
// give ourselves a while to serve it, and to allow sockjs long polls to                 // 228
// complete.  On the other hand, we want to close idle sockets relatively                // 229
// quickly, so that we can shut down relatively promptly but cleanly, without            // 230
// cutting off anyone's response.                                                        // 231
WebApp._timeoutAdjustmentRequestCallback = function (req, res) {                         // 232
  // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);                     // 233
  req.setTimeout(LONG_SOCKET_TIMEOUT);                                                   // 234
  // Insert our new finish listener to run BEFORE the existing one which removes         // 235
  // the response from the socket.                                                       // 236
  var finishListeners = res.listeners('finish');                                         // 237
  // XXX Apparently in Node 0.12 this event is now called 'prefinish'.                   // 238
  // https://github.com/joyent/node/commit/7c9b6070                                      // 239
  res.removeAllListeners('finish');                                                      // 240
  res.on('finish', function () {                                                         // 241
    res.setTimeout(SHORT_SOCKET_TIMEOUT);                                                // 242
  });                                                                                    // 243
  _.each(finishListeners, function (l) { res.on('finish', l); });                        // 244
};                                                                                       // 245
                                                                                         // 246
                                                                                         // 247
// Will be updated by main before we listen.                                             // 248
// Map from client arch to boilerplate object.                                           // 249
// Boilerplate object has:                                                               // 250
//   - func: XXX                                                                         // 251
//   - baseData: XXX                                                                     // 252
var boilerplateByArch = {};                                                              // 253
                                                                                         // 254
// Given a request (as returned from `categorizeRequest`), return the                    // 255
// boilerplate HTML to serve for that request. Memoizes on HTML                          // 256
// attributes (used by, eg, appcache) and whether inline scripts are                     // 257
// currently allowed.                                                                    // 258
// XXX so far this function is always called with arch === 'web.browser'                 // 259
var memoizedBoilerplate = {};                                                            // 260
var getBoilerplate = function (request, arch) {                                          // 261
                                                                                         // 262
  var htmlAttributes = getHtmlAttributes(request);                                       // 263
                                                                                         // 264
  // The only thing that changes from request to request (for now) are                   // 265
  // the HTML attributes (used by, eg, appcache) and whether inline                      // 266
  // scripts are allowed, so we can memoize based on that.                               // 267
  var memHash = JSON.stringify({                                                         // 268
    inlineScriptsAllowed: inlineScriptsAllowed,                                          // 269
    htmlAttributes: htmlAttributes,                                                      // 270
    arch: arch                                                                           // 271
  });                                                                                    // 272
                                                                                         // 273
  if (! memoizedBoilerplate[memHash]) {                                                  // 274
    memoizedBoilerplate[memHash] = boilerplateByArch[arch].toHTML({                      // 275
      htmlAttributes: htmlAttributes                                                     // 276
    });                                                                                  // 277
  }                                                                                      // 278
  return memoizedBoilerplate[memHash];                                                   // 279
};                                                                                       // 280
                                                                                         // 281
var generateBoilerplateInstance = function (arch, manifest, additionalOptions) {         // 282
  additionalOptions = additionalOptions || {};                                           // 283
  var runtimeConfig = _.defaults(__meteor_runtime_config__,                              // 284
    additionalOptions.runtimeConfigDefaults || {}                                        // 285
  );                                                                                     // 286
                                                                                         // 287
  return new Boilerplate(arch, manifest,                                                 // 288
    _.extend({                                                                           // 289
      pathMapper: function (itemPath) {                                                  // 290
        return path.join(archPath[arch], itemPath); },                                   // 291
      baseDataExtension: {                                                               // 292
        additionalStaticJs: _.map(                                                       // 293
          additionalStaticJs || [],                                                      // 294
          function (contents, pathname) {                                                // 295
            return {                                                                     // 296
              pathname: pathname,                                                        // 297
              contents: contents                                                         // 298
            };                                                                           // 299
          }                                                                              // 300
        ),                                                                               // 301
        meteorRuntimeConfig: JSON.stringify(runtimeConfig),                              // 302
        rootUrlPathPrefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',         // 303
        bundledJsCssPrefix: bundledJsCssPrefix ||                                        // 304
          __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',                          // 305
        inlineScriptsAllowed: WebAppInternals.inlineScriptsAllowed(),                    // 306
        inline: additionalOptions.inline                                                 // 307
      }                                                                                  // 308
    }, additionalOptions)                                                                // 309
  );                                                                                     // 310
};                                                                                       // 311
                                                                                         // 312
// A mapping from url path to "info". Where "info" has the following fields:             // 313
// - type: the type of file to be served                                                 // 314
// - cacheable: optionally, whether the file should be cached or not                     // 315
// - sourceMapUrl: optionally, the url of the source map                                 // 316
//                                                                                       // 317
// Info also contains one of the following:                                              // 318
// - content: the stringified content that should be served at this path                 // 319
// - absolutePath: the absolute path on disk to the file                                 // 320
                                                                                         // 321
var staticFiles;                                                                         // 322
                                                                                         // 323
// Serve static files from the manifest or added with                                    // 324
// `addStaticJs`. Exported for tests.                                                    // 325
WebAppInternals.staticFilesMiddleware = function (staticFiles, req, res, next) {         // 326
  if ('GET' != req.method && 'HEAD' != req.method) {                                     // 327
    next();                                                                              // 328
    return;                                                                              // 329
  }                                                                                      // 330
  var pathname = connect.utils.parseUrl(req).pathname;                                   // 331
  try {                                                                                  // 332
    pathname = decodeURIComponent(pathname);                                             // 333
  } catch (e) {                                                                          // 334
    next();                                                                              // 335
    return;                                                                              // 336
  }                                                                                      // 337
                                                                                         // 338
  var serveStaticJs = function (s) {                                                     // 339
    res.writeHead(200, {                                                                 // 340
      'Content-type': 'application/javascript; charset=UTF-8'                            // 341
    });                                                                                  // 342
    res.write(s);                                                                        // 343
    res.end();                                                                           // 344
  };                                                                                     // 345
                                                                                         // 346
  if (pathname === "/meteor_runtime_config.js" &&                                        // 347
      ! WebAppInternals.inlineScriptsAllowed()) {                                        // 348
    serveStaticJs("__meteor_runtime_config__ = " +                                       // 349
                  JSON.stringify(__meteor_runtime_config__) + ";");                      // 350
    return;                                                                              // 351
  } else if (_.has(additionalStaticJs, pathname) &&                                      // 352
              ! WebAppInternals.inlineScriptsAllowed()) {                                // 353
    serveStaticJs(additionalStaticJs[pathname]);                                         // 354
    return;                                                                              // 355
  }                                                                                      // 356
                                                                                         // 357
  if (!_.has(staticFiles, pathname)) {                                                   // 358
    next();                                                                              // 359
    return;                                                                              // 360
  }                                                                                      // 361
                                                                                         // 362
  // We don't need to call pause because, unlike 'static', once we call into             // 363
  // 'send' and yield to the event loop, we never call another handler with              // 364
  // 'next'.                                                                             // 365
                                                                                         // 366
  var info = staticFiles[pathname];                                                      // 367
                                                                                         // 368
  // Cacheable files are files that should never change. Typically                       // 369
  // named by their hash (eg meteor bundled js and css files).                           // 370
  // We cache them ~forever (1yr).                                                       // 371
  //                                                                                     // 372
  // We cache non-cacheable files anyway. This isn't really correct, as users            // 373
  // can change the files and changes won't propagate immediately. However, if           // 374
  // we don't cache them, browsers will 'flicker' when rerendering                       // 375
  // images. Eventually we will probably want to rewrite URLs of static assets           // 376
  // to include a query parameter to bust caches. That way we can both get               // 377
  // good caching behavior and allow users to change assets without delay.               // 378
  // https://github.com/meteor/meteor/issues/773                                         // 379
  var maxAge = info.cacheable                                                            // 380
        ? 1000 * 60 * 60 * 24 * 365                                                      // 381
        : 1000 * 60 * 60 * 24;                                                           // 382
                                                                                         // 383
  // Set the X-SourceMap header, which current Chrome, FireFox, and Safari               // 384
  // understand.  (The SourceMap header is slightly more spec-correct but FF             // 385
  // doesn't understand it.)                                                             // 386
  //                                                                                     // 387
  // You may also need to enable source maps in Chrome: open dev tools, click            // 388
  // the gear in the bottom right corner, and select "enable source maps".               // 389
  if (info.sourceMapUrl)                                                                 // 390
    res.setHeader('X-SourceMap', info.sourceMapUrl);                                     // 391
                                                                                         // 392
  if (info.type === "js") {                                                              // 393
    res.setHeader("Content-Type", "application/javascript; charset=UTF-8");              // 394
  } else if (info.type === "css") {                                                      // 395
    res.setHeader("Content-Type", "text/css; charset=UTF-8");                            // 396
  } else if (info.type === "json") {                                                     // 397
    res.setHeader("Content-Type", "application/json; charset=UTF-8");                    // 398
    // XXX if it is a manifest we are serving, set additional headers                    // 399
    if (/\/manifest.json$/.test(pathname)) {                                             // 400
      res.setHeader("Access-Control-Allow-Origin", "*");                                 // 401
    }                                                                                    // 402
  }                                                                                      // 403
                                                                                         // 404
  if (info.content) {                                                                    // 405
    res.write(info.content);                                                             // 406
    res.end();                                                                           // 407
  } else {                                                                               // 408
    send(req, info.absolutePath)                                                         // 409
      .maxage(maxAge)                                                                    // 410
      .hidden(true)  // if we specified a dotfile in the manifest, serve it              // 411
      .on('error', function (err) {                                                      // 412
        Log.error("Error serving static file " + err);                                   // 413
        res.writeHead(500);                                                              // 414
        res.end();                                                                       // 415
      })                                                                                 // 416
      .on('directory', function () {                                                     // 417
        Log.error("Unexpected directory " + info.absolutePath);                          // 418
        res.writeHead(500);                                                              // 419
        res.end();                                                                       // 420
      })                                                                                 // 421
      .pipe(res);                                                                        // 422
  }                                                                                      // 423
};                                                                                       // 424
                                                                                         // 425
var getUrlPrefixForArch = function (arch) {                                              // 426
  // XXX we rely on the fact that arch names don't contain slashes                       // 427
  // in that case we would need to uri escape it                                         // 428
                                                                                         // 429
  // We add '__' to the beginning of non-standard archs to "scope" the url               // 430
  // to Meteor internals.                                                                // 431
  return arch === WebApp.defaultArch ?                                                   // 432
    '' : '/' + '__' + arch.replace(/^web\./, '');                                        // 433
};                                                                                       // 434
                                                                                         // 435
var runWebAppServer = function () {                                                      // 436
  var shuttingDown = false;                                                              // 437
  var syncQueue = new Meteor._SynchronousQueue();                                        // 438
                                                                                         // 439
  var getItemPathname = function (itemUrl) {                                             // 440
    return decodeURIComponent(url.parse(itemUrl).pathname);                              // 441
  };                                                                                     // 442
                                                                                         // 443
  WebAppInternals.reloadClientPrograms = function () {                                   // 444
    syncQueue.runTask(function() {                                                       // 445
      staticFiles = {};                                                                  // 446
      var generateClientProgram = function (clientPath, arch) {                          // 447
        // read the control for the client we'll be serving up                           // 448
        var clientJsonPath = path.join(__meteor_bootstrap__.serverDir,                   // 449
                                   clientPath);                                          // 450
        var clientDir = path.dirname(clientJsonPath);                                    // 451
        var clientJson = JSON.parse(readUtf8FileSync(clientJsonPath));                   // 452
        if (clientJson.format !== "web-program-pre1")                                    // 453
          throw new Error("Unsupported format for client assets: " +                     // 454
                          JSON.stringify(clientJson.format));                            // 455
                                                                                         // 456
        if (! clientJsonPath || ! clientDir || ! clientJson)                             // 457
          throw new Error("Client config file not parsed.");                             // 458
                                                                                         // 459
        var urlPrefix = getUrlPrefixForArch(arch);                                       // 460
                                                                                         // 461
        var manifest = clientJson.manifest;                                              // 462
        _.each(manifest, function (item) {                                               // 463
          if (item.url && item.where === "client") {                                     // 464
            staticFiles[urlPrefix + getItemPathname(item.url)] = {                       // 465
              absolutePath: path.join(clientDir, item.path),                             // 466
              cacheable: item.cacheable,                                                 // 467
              // Link from source to its map                                             // 468
              sourceMapUrl: item.sourceMapUrl,                                           // 469
              type: item.type                                                            // 470
            };                                                                           // 471
                                                                                         // 472
            if (item.sourceMap) {                                                        // 473
              // Serve the source map too, under the specified URL. We assume all        // 474
              // source maps are cacheable.                                              // 475
              staticFiles[urlPrefix + getItemPathname(item.sourceMapUrl)] = {            // 476
                absolutePath: path.join(clientDir, item.sourceMap),                      // 477
                cacheable: true                                                          // 478
              };                                                                         // 479
            }                                                                            // 480
          }                                                                              // 481
        });                                                                              // 482
                                                                                         // 483
        var program = {                                                                  // 484
          manifest: manifest,                                                            // 485
          version: WebAppHashing.calculateClientHash(manifest, null, _.pick(             // 486
            __meteor_runtime_config__, 'PUBLIC_SETTINGS')),                              // 487
          PUBLIC_SETTINGS: __meteor_runtime_config__.PUBLIC_SETTINGS                     // 488
        };                                                                               // 489
                                                                                         // 490
        WebApp.clientPrograms[arch] = program;                                           // 491
                                                                                         // 492
        // Serve the program as a string at /foo/<arch>/manifest.json                    // 493
        // XXX change manifest.json -> program.json                                      // 494
        staticFiles[path.join(urlPrefix, 'manifest.json')] = {                           // 495
          content: JSON.stringify(program),                                              // 496
          cacheable: true,                                                               // 497
          type: "json"                                                                   // 498
        };                                                                               // 499
      };                                                                                 // 500
                                                                                         // 501
      try {                                                                              // 502
        var clientPaths = __meteor_bootstrap__.configJson.clientPaths;                   // 503
        _.each(clientPaths, function (clientPath, arch) {                                // 504
          archPath[arch] = path.dirname(clientPath);                                     // 505
          generateClientProgram(clientPath, arch);                                       // 506
        });                                                                              // 507
                                                                                         // 508
        // Exported for tests.                                                           // 509
        WebAppInternals.staticFiles = staticFiles;                                       // 510
      } catch (e) {                                                                      // 511
        Log.error("Error reloading the client program: " + e.stack);                     // 512
        process.exit(1);                                                                 // 513
      }                                                                                  // 514
    });                                                                                  // 515
  };                                                                                     // 516
                                                                                         // 517
  WebAppInternals.generateBoilerplate = function () {                                    // 518
    // This boilerplate will be served to the mobile devices when used with              // 519
    // Meteor/Cordova for the Hot-Code Push and since the file will be served by         // 520
    // the device's server, it is important to set the DDP url to the actual             // 521
    // Meteor server accepting DDP connections and not the device's file server.         // 522
    var defaultOptionsForArch = {                                                        // 523
      'web.cordova': {                                                                   // 524
        runtimeConfigDefaults: {                                                         // 525
          DDP_DEFAULT_CONNECTION_URL: __meteor_runtime_config__.ROOT_URL                 // 526
        }                                                                                // 527
      }                                                                                  // 528
    };                                                                                   // 529
                                                                                         // 530
    syncQueue.runTask(function() {                                                       // 531
      _.each(WebApp.clientPrograms, function (program, archName) {                       // 532
        boilerplateByArch[archName] =                                                    // 533
          generateBoilerplateInstance(archName, program.manifest,                        // 534
                                      defaultOptionsForArch[archName]);                  // 535
      });                                                                                // 536
                                                                                         // 537
      // Clear the memoized boilerplate cache.                                           // 538
      memoizedBoilerplate = {};                                                          // 539
                                                                                         // 540
      // Configure CSS injection for the default arch                                    // 541
      // XXX implement the CSS injection for all archs?                                  // 542
      WebAppInternals.refreshableAssets = {                                              // 543
        allCss: boilerplateByArch[WebApp.defaultArch].baseData.css                       // 544
      };                                                                                 // 545
    });                                                                                  // 546
  };                                                                                     // 547
                                                                                         // 548
  WebAppInternals.reloadClientPrograms();                                                // 549
                                                                                         // 550
  // webserver                                                                           // 551
  var app = connect();                                                                   // 552
                                                                                         // 553
  // Auto-compress any json, javascript, or text.                                        // 554
  app.use(connect.compress());                                                           // 555
                                                                                         // 556
  // Packages and apps can add handlers that run before any other Meteor                 // 557
  // handlers via WebApp.rawConnectHandlers.                                             // 558
  var rawConnectHandlers = connect();                                                    // 559
  app.use(rawConnectHandlers);                                                           // 560
                                                                                         // 561
  // Strip off the path prefix, if it exists.                                            // 562
  app.use(function (request, response, next) {                                           // 563
    var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;                     // 564
    var url = Npm.require('url').parse(request.url);                                     // 565
    var pathname = url.pathname;                                                         // 566
    // check if the path in the url starts with the path prefix (and the part            // 567
    // after the path prefix must start with a / if it exists.)                          // 568
    if (pathPrefix && pathname.substring(0, pathPrefix.length) === pathPrefix &&         // 569
       (pathname.length == pathPrefix.length                                             // 570
        || pathname.substring(pathPrefix.length, pathPrefix.length + 1) === "/")) {      // 571
      request.url = request.url.substring(pathPrefix.length);                            // 572
      next();                                                                            // 573
    } else if (pathname === "/favicon.ico" || pathname === "/robots.txt") {              // 574
      next();                                                                            // 575
    } else if (pathPrefix) {                                                             // 576
      response.writeHead(404);                                                           // 577
      response.write("Unknown path");                                                    // 578
      response.end();                                                                    // 579
    } else {                                                                             // 580
      next();                                                                            // 581
    }                                                                                    // 582
  });                                                                                    // 583
                                                                                         // 584
  // Parse the query string into res.query. Used by oauth_server, but it's               // 585
  // generally pretty handy..                                                            // 586
  app.use(connect.query());                                                              // 587
                                                                                         // 588
  // Serve static files from the manifest.                                               // 589
  // This is inspired by the 'static' middleware.                                        // 590
  app.use(function (req, res, next) {                                                    // 591
    Fiber(function () {                                                                  // 592
     WebAppInternals.staticFilesMiddleware(staticFiles, req, res, next);                 // 593
    }).run();                                                                            // 594
  });                                                                                    // 595
                                                                                         // 596
  // Packages and apps can add handlers to this via WebApp.connectHandlers.              // 597
  // They are inserted before our default handler.                                       // 598
  var packageAndAppHandlers = connect();                                                 // 599
  app.use(packageAndAppHandlers);                                                        // 600
                                                                                         // 601
  var suppressConnectErrors = false;                                                     // 602
  // connect knows it is an error handler because it has 4 arguments instead of          // 603
  // 3. go figure.  (It is not smart enough to find such a thing if it's hidden          // 604
  // inside packageAndAppHandlers.)                                                      // 605
  app.use(function (err, req, res, next) {                                               // 606
    if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {            // 607
      next(err);                                                                         // 608
      return;                                                                            // 609
    }                                                                                    // 610
    res.writeHead(err.status, { 'Content-Type': 'text/plain' });                         // 611
    res.end("An error message");                                                         // 612
  });                                                                                    // 613
                                                                                         // 614
  app.use(function (req, res, next) {                                                    // 615
    if (! appUrl(req.url))                                                               // 616
      return next();                                                                     // 617
                                                                                         // 618
    var headers = {                                                                      // 619
      'Content-Type':  'text/html; charset=utf-8'                                        // 620
    };                                                                                   // 621
    if (shuttingDown)                                                                    // 622
      headers['Connection'] = 'Close';                                                   // 623
                                                                                         // 624
    var request = WebApp.categorizeRequest(req);                                         // 625
                                                                                         // 626
    if (request.url.query && request.url.query['meteor_css_resource']) {                 // 627
      // In this case, we're requesting a CSS resource in the meteor-specific            // 628
      // way, but we don't have it.  Serve a static css file that indicates that         // 629
      // we didn't have it, so we can detect that and refresh.                           // 630
      headers['Content-Type'] = 'text/css; charset=utf-8';                               // 631
      res.writeHead(200, headers);                                                       // 632
      res.write(".meteor-css-not-found-error { width: 0px;}");                           // 633
      res.end();                                                                         // 634
      return undefined;                                                                  // 635
    }                                                                                    // 636
                                                                                         // 637
    // /packages/asdfsad ... /__cordova/dafsdf.js                                        // 638
    var pathname = connect.utils.parseUrl(req).pathname;                                 // 639
    var archKey = pathname.split('/')[1];                                                // 640
    var archKeyCleaned = 'web.' + archKey.replace(/^__/, '');                            // 641
                                                                                         // 642
    if (! /^__/.test(archKey) || ! _.has(archPath, archKeyCleaned)) {                    // 643
      archKey = WebApp.defaultArch;                                                      // 644
    } else {                                                                             // 645
      archKey = archKeyCleaned;                                                          // 646
    }                                                                                    // 647
                                                                                         // 648
    var boilerplate;                                                                     // 649
    try {                                                                                // 650
      boilerplate = getBoilerplate(request, archKey);                                    // 651
    } catch (e) {                                                                        // 652
      Log.error("Error running template: " + e);                                         // 653
      res.writeHead(500, headers);                                                       // 654
      res.end();                                                                         // 655
      return undefined;                                                                  // 656
    }                                                                                    // 657
                                                                                         // 658
    res.writeHead(200, headers);                                                         // 659
    res.write(boilerplate);                                                              // 660
    res.end();                                                                           // 661
    return undefined;                                                                    // 662
  });                                                                                    // 663
                                                                                         // 664
  // Return 404 by default, if no other handlers serve this URL.                         // 665
  app.use(function (req, res) {                                                          // 666
    res.writeHead(404);                                                                  // 667
    res.end();                                                                           // 668
  });                                                                                    // 669
                                                                                         // 670
                                                                                         // 671
  var httpServer = http.createServer(app);                                               // 672
  var onListeningCallbacks = [];                                                         // 673
                                                                                         // 674
  // After 5 seconds w/o data on a socket, kill it.  On the other hand, if               // 675
  // there's an outstanding request, give it a higher timeout instead (to avoid          // 676
  // killing long-polling requests)                                                      // 677
  httpServer.setTimeout(SHORT_SOCKET_TIMEOUT);                                           // 678
                                                                                         // 679
  // Do this here, and then also in livedata/stream_server.js, because                   // 680
  // stream_server.js kills all the current request handlers when installing its         // 681
  // own.                                                                                // 682
  httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback);                    // 683
                                                                                         // 684
                                                                                         // 685
  // For now, handle SIGHUP here.  Later, this should be in some centralized             // 686
  // Meteor shutdown code.                                                               // 687
  process.on('SIGHUP', Meteor.bindEnvironment(function () {                              // 688
    shuttingDown = true;                                                                 // 689
    // tell others with websockets open that we plan to close this.                      // 690
    // XXX: Eventually, this should be done with a standard meteor shut-down             // 691
    // logic path.                                                                       // 692
    httpServer.emit('meteor-closing');                                                   // 693
                                                                                         // 694
    httpServer.close(Meteor.bindEnvironment(function () {                                // 695
      if (proxy) {                                                                       // 696
        try {                                                                            // 697
          proxy.call('removeBindingsForJob', process.env.GALAXY_JOB);                    // 698
        } catch (e) {                                                                    // 699
          Log.error("Error removing bindings: " + e.message);                            // 700
          process.exit(1);                                                               // 701
        }                                                                                // 702
      }                                                                                  // 703
      process.exit(0);                                                                   // 704
                                                                                         // 705
    }, "On http server close failed"));                                                  // 706
                                                                                         // 707
    // Ideally we will close before this hits.                                           // 708
    Meteor.setTimeout(function () {                                                      // 709
      Log.warn("Closed by SIGHUP but one or more HTTP requests may not have finished."); // 710
      process.exit(1);                                                                   // 711
    }, 5000);                                                                            // 712
                                                                                         // 713
  }, function (err) {                                                                    // 714
    console.log(err);                                                                    // 715
    process.exit(1);                                                                     // 716
  }));                                                                                   // 717
                                                                                         // 718
  // start up app                                                                        // 719
  _.extend(WebApp, {                                                                     // 720
    connectHandlers: packageAndAppHandlers,                                              // 721
    rawConnectHandlers: rawConnectHandlers,                                              // 722
    httpServer: httpServer,                                                              // 723
    // For testing.                                                                      // 724
    suppressConnectErrors: function () {                                                 // 725
      suppressConnectErrors = true;                                                      // 726
    },                                                                                   // 727
    onListening: function (f) {                                                          // 728
      if (onListeningCallbacks)                                                          // 729
        onListeningCallbacks.push(f);                                                    // 730
      else                                                                               // 731
        f();                                                                             // 732
    },                                                                                   // 733
    // Hack: allow http tests to call connect.basicAuth without making them              // 734
    // Npm.depends on another copy of connect. (That would be fine if we could           // 735
    // have test-only NPM dependencies but is overkill here.)                            // 736
    __basicAuth__: connect.basicAuth                                                     // 737
  });                                                                                    // 738
                                                                                         // 739
  // Let the rest of the packages (and Meteor.startup hooks) insert connect              // 740
  // middlewares and update __meteor_runtime_config__, then keep going to set up         // 741
  // actually serving HTML.                                                              // 742
  main = function (argv) {                                                               // 743
    // main happens post startup hooks, so we don't need a Meteor.startup() to           // 744
    // ensure this happens after the galaxy package is loaded.                           // 745
    var AppConfig = Package["application-configuration"].AppConfig;                      // 746
    // We used to use the optimist npm package to parse argv here, but it's              // 747
    // overkill (and no longer in the dev bundle). Just assume any instance of           // 748
    // '--keepalive' is a use of the option.                                             // 749
    var expectKeepalives = _.contains(argv, '--keepalive');                              // 750
    WebAppInternals.generateBoilerplate();                                               // 751
                                                                                         // 752
    // only start listening after all the startup code has run.                          // 753
    var localPort = parseInt(process.env.PORT) || 0;                                     // 754
    var host = process.env.BIND_IP;                                                      // 755
    var localIp = host || '0.0.0.0';                                                     // 756
    httpServer.listen(localPort, localIp, Meteor.bindEnvironment(function() {            // 757
      if (expectKeepalives)                                                              // 758
        console.log("LISTENING"); // must match run-app.js                               // 759
      var proxyBinding;                                                                  // 760
                                                                                         // 761
      AppConfig.configurePackage('webapp', function (configuration) {                    // 762
        if (proxyBinding)                                                                // 763
          proxyBinding.stop();                                                           // 764
        if (configuration && configuration.proxy) {                                      // 765
          // TODO: We got rid of the place where this checks the app's                   // 766
          // configuration, because this wants to be configured for some things          // 767
          // on a per-job basis.  Discuss w/ teammates.                                  // 768
          proxyBinding = AppConfig.configureService(                                     // 769
            "proxy",                                                                     // 770
            "pre0",                                                                      // 771
            function (proxyService) {                                                    // 772
              if (proxyService && ! _.isEmpty(proxyService)) {                           // 773
                var proxyConf;                                                           // 774
                // XXX Figure out a per-job way to specify bind location                 // 775
                // (besides hardcoding the location for ADMIN_APP jobs).                 // 776
                if (process.env.ADMIN_APP) {                                             // 777
                  var bindPathPrefix = "";                                               // 778
                  if (process.env.GALAXY_APP !== "panel") {                              // 779
                    bindPathPrefix = "/" + bindPathPrefix +                              // 780
                      encodeURIComponent(                                                // 781
                        process.env.GALAXY_APP                                           // 782
                      ).replace(/\./g, '_');                                             // 783
                  }                                                                      // 784
                  proxyConf = {                                                          // 785
                    bindHost: process.env.GALAXY_NAME,                                   // 786
                    bindPathPrefix: bindPathPrefix,                                      // 787
                    requiresAuth: true                                                   // 788
                  };                                                                     // 789
                } else {                                                                 // 790
                  proxyConf = configuration.proxy;                                       // 791
                }                                                                        // 792
                Log("Attempting to bind to proxy at " +                                  // 793
                    proxyService);                                                       // 794
                WebAppInternals.bindToProxy(_.extend({                                   // 795
                  proxyEndpoint: proxyService                                            // 796
                }, proxyConf));                                                          // 797
              }                                                                          // 798
            }                                                                            // 799
          );                                                                             // 800
        }                                                                                // 801
      });                                                                                // 802
                                                                                         // 803
      var callbacks = onListeningCallbacks;                                              // 804
      onListeningCallbacks = null;                                                       // 805
      _.each(callbacks, function (x) { x(); });                                          // 806
                                                                                         // 807
    }, function (e) {                                                                    // 808
      console.error("Error listening:", e);                                              // 809
      console.error(e && e.stack);                                                       // 810
    }));                                                                                 // 811
                                                                                         // 812
    if (expectKeepalives)                                                                // 813
      initKeepalive();                                                                   // 814
    return 'DAEMON';                                                                     // 815
  };                                                                                     // 816
};                                                                                       // 817
                                                                                         // 818
                                                                                         // 819
var proxy;                                                                               // 820
WebAppInternals.bindToProxy = function (proxyConfig) {                                   // 821
  var securePort = proxyConfig.securePort || 4433;                                       // 822
  var insecurePort = proxyConfig.insecurePort || 8080;                                   // 823
  var bindPathPrefix = proxyConfig.bindPathPrefix || "";                                 // 824
  // XXX also support galaxy-based lookup                                                // 825
  if (!proxyConfig.proxyEndpoint)                                                        // 826
    throw new Error("missing proxyEndpoint");                                            // 827
  if (!proxyConfig.bindHost)                                                             // 828
    throw new Error("missing bindHost");                                                 // 829
  if (!process.env.GALAXY_JOB)                                                           // 830
    throw new Error("missing $GALAXY_JOB");                                              // 831
  if (!process.env.GALAXY_APP)                                                           // 832
    throw new Error("missing $GALAXY_APP");                                              // 833
  if (!process.env.LAST_START)                                                           // 834
    throw new Error("missing $LAST_START");                                              // 835
                                                                                         // 836
  // XXX rename pid argument to bindTo.                                                  // 837
  // XXX factor out into a 'getPid' function in a 'galaxy' package?                      // 838
  var pid = {                                                                            // 839
    job: process.env.GALAXY_JOB,                                                         // 840
    lastStarted: +(process.env.LAST_START),                                              // 841
    app: process.env.GALAXY_APP                                                          // 842
  };                                                                                     // 843
  var myHost = os.hostname();                                                            // 844
                                                                                         // 845
  WebAppInternals.usingDdpProxy = true;                                                  // 846
                                                                                         // 847
  // This is run after packages are loaded (in main) so we can use                       // 848
  // Follower.connect.                                                                   // 849
  if (proxy) {                                                                           // 850
    // XXX the concept here is that our configuration has changed and                    // 851
    // we have connected to an entirely new follower set, which does                     // 852
    // not have the state that we set up on the follower set that we                     // 853
    // were previously connected to, and so we need to recreate all of                   // 854
    // our bindings -- analogous to getting a SIGHUP and rereading                       // 855
    // your configuration file. so probably this should actually tear                    // 856
    // down the connection and make a whole new one, rather than                         // 857
    // hot-reconnecting to a different URL.                                              // 858
    proxy.reconnect({                                                                    // 859
      url: proxyConfig.proxyEndpoint                                                     // 860
    });                                                                                  // 861
  } else {                                                                               // 862
    proxy = Package["follower-livedata"].Follower.connect(                               // 863
      proxyConfig.proxyEndpoint, {                                                       // 864
        group: "proxy"                                                                   // 865
      }                                                                                  // 866
    );                                                                                   // 867
  }                                                                                      // 868
                                                                                         // 869
  var route = process.env.ROUTE;                                                         // 870
  var ourHost = route.split(":")[0];                                                     // 871
  var ourPort = +route.split(":")[1];                                                    // 872
                                                                                         // 873
  var outstanding = 0;                                                                   // 874
  var startedAll = false;                                                                // 875
  var checkComplete = function () {                                                      // 876
    if (startedAll && ! outstanding)                                                     // 877
      Log("Bound to proxy.");                                                            // 878
  };                                                                                     // 879
  var makeCallback = function () {                                                       // 880
    outstanding++;                                                                       // 881
    return function (err) {                                                              // 882
      if (err)                                                                           // 883
        throw err;                                                                       // 884
      outstanding--;                                                                     // 885
      checkComplete();                                                                   // 886
    };                                                                                   // 887
  };                                                                                     // 888
                                                                                         // 889
  // for now, have our (temporary) requiresAuth flag apply to all                        // 890
  // routes created by this process.                                                     // 891
  var requiresDdpAuth = !! proxyConfig.requiresAuth;                                     // 892
  var requiresHttpAuth = (!! proxyConfig.requiresAuth) &&                                // 893
        (pid.app !== "panel" && pid.app !== "auth");                                     // 894
                                                                                         // 895
  // XXX a current limitation is that we treat securePort and                            // 896
  // insecurePort as a global configuration parameter -- we assume                       // 897
  // that if the proxy wants us to ask for 8080 to get port 80 traffic                   // 898
  // on our default hostname, that's the same port that we would use                     // 899
  // to get traffic on some other hostname that our proxy listens                        // 900
  // for. Likewise, we assume that if the proxy can receive secure                       // 901
  // traffic for our domain, it can assume secure traffic for any                        // 902
  // domain! Hopefully this will get cleaned up before too long by                       // 903
  // pushing that logic into the proxy service, so we can just ask for                   // 904
  // port 80.                                                                            // 905
                                                                                         // 906
  // XXX BUG: if our configuration changes, and bindPathPrefix                           // 907
  // changes, it appears that we will not remove the routes derived                      // 908
  // from the old bindPathPrefix from the proxy (until the process                       // 909
  // exits). It is not actually normal for bindPathPrefix to change,                     // 910
  // certainly not without a process restart for other reasons, but                      // 911
  // it'd be nice to fix.                                                                // 912
                                                                                         // 913
  _.each(routes, function (route) {                                                      // 914
    var parsedUrl = url.parse(route.url, /* parseQueryString */ false,                   // 915
                              /* slashesDenoteHost aka workRight */ true);               // 916
    if (parsedUrl.protocol || parsedUrl.port || parsedUrl.search)                        // 917
      throw new Error("Bad url");                                                        // 918
    parsedUrl.host = null;                                                               // 919
    parsedUrl.path = null;                                                               // 920
    if (! parsedUrl.hostname) {                                                          // 921
      parsedUrl.hostname = proxyConfig.bindHost;                                         // 922
      if (! parsedUrl.pathname)                                                          // 923
        parsedUrl.pathname = "";                                                         // 924
      if (! parsedUrl.pathname.indexOf("/") !== 0) {                                     // 925
        // Relative path                                                                 // 926
        parsedUrl.pathname = bindPathPrefix + parsedUrl.pathname;                        // 927
      }                                                                                  // 928
    }                                                                                    // 929
    var version = "";                                                                    // 930
                                                                                         // 931
    var AppConfig = Package["application-configuration"].AppConfig;                      // 932
    version = AppConfig.getStarForThisJob() || "";                                       // 933
                                                                                         // 934
                                                                                         // 935
    var parsedDdpUrl = _.clone(parsedUrl);                                               // 936
    parsedDdpUrl.protocol = "ddp";                                                       // 937
    // Node has a hardcoded list of protocols that get '://' instead                     // 938
    // of ':'. ddp needs to be added to that whitelist. Until then, we                   // 939
    // can set the undocumented attribute 'slashes' to get the right                     // 940
    // behavior. It's not clear whether than is by design or accident.                   // 941
    parsedDdpUrl.slashes = true;                                                         // 942
    parsedDdpUrl.port = '' + securePort;                                                 // 943
    var ddpUrl = url.format(parsedDdpUrl);                                               // 944
                                                                                         // 945
    var proxyToHost, proxyToPort, proxyToPathPrefix;                                     // 946
    if (! _.has(route, 'forwardTo')) {                                                   // 947
      proxyToHost = ourHost;                                                             // 948
      proxyToPort = ourPort;                                                             // 949
      proxyToPathPrefix = parsedUrl.pathname;                                            // 950
    } else {                                                                             // 951
      var parsedFwdUrl = url.parse(route.forwardTo, false, true);                        // 952
      if (! parsedFwdUrl.hostname || parsedFwdUrl.protocol)                              // 953
        throw new Error("Bad forward url");                                              // 954
      proxyToHost = parsedFwdUrl.hostname;                                               // 955
      proxyToPort = parseInt(parsedFwdUrl.port || "80");                                 // 956
      proxyToPathPrefix = parsedFwdUrl.pathname || "";                                   // 957
    }                                                                                    // 958
                                                                                         // 959
    if (route.ddp) {                                                                     // 960
      proxy.call('bindDdp', {                                                            // 961
        pid: pid,                                                                        // 962
        bindTo: {                                                                        // 963
          ddpUrl: ddpUrl,                                                                // 964
          insecurePort: insecurePort                                                     // 965
        },                                                                               // 966
        proxyTo: {                                                                       // 967
          tags: [version],                                                               // 968
          host: proxyToHost,                                                             // 969
          port: proxyToPort,                                                             // 970
          pathPrefix: proxyToPathPrefix + '/websocket'                                   // 971
        },                                                                               // 972
        requiresAuth: requiresDdpAuth                                                    // 973
      }, makeCallback());                                                                // 974
    }                                                                                    // 975
                                                                                         // 976
    if (route.http) {                                                                    // 977
      proxy.call('bindHttp', {                                                           // 978
        pid: pid,                                                                        // 979
        bindTo: {                                                                        // 980
          host: parsedUrl.hostname,                                                      // 981
          port: insecurePort,                                                            // 982
          pathPrefix: parsedUrl.pathname                                                 // 983
        },                                                                               // 984
        proxyTo: {                                                                       // 985
          tags: [version],                                                               // 986
          host: proxyToHost,                                                             // 987
          port: proxyToPort,                                                             // 988
          pathPrefix: proxyToPathPrefix                                                  // 989
        },                                                                               // 990
        requiresAuth: requiresHttpAuth                                                   // 991
      }, makeCallback());                                                                // 992
                                                                                         // 993
      // Only make the secure binding if we've been told that the                        // 994
      // proxy knows how terminate secure connections for us (has an                     // 995
      // appropriate cert, can bind the necessary port..)                                // 996
      if (proxyConfig.securePort !== null) {                                             // 997
        proxy.call('bindHttp', {                                                         // 998
          pid: pid,                                                                      // 999
          bindTo: {                                                                      // 1000
            host: parsedUrl.hostname,                                                    // 1001
            port: securePort,                                                            // 1002
            pathPrefix: parsedUrl.pathname,                                              // 1003
            ssl: true                                                                    // 1004
          },                                                                             // 1005
          proxyTo: {                                                                     // 1006
            tags: [version],                                                             // 1007
            host: proxyToHost,                                                           // 1008
            port: proxyToPort,                                                           // 1009
            pathPrefix: proxyToPathPrefix                                                // 1010
          },                                                                             // 1011
          requiresAuth: requiresHttpAuth                                                 // 1012
        }, makeCallback());                                                              // 1013
      }                                                                                  // 1014
    }                                                                                    // 1015
  });                                                                                    // 1016
                                                                                         // 1017
  startedAll = true;                                                                     // 1018
  checkComplete();                                                                       // 1019
};                                                                                       // 1020
                                                                                         // 1021
// (Internal, unsupported interface -- subject to change)                                // 1022
//                                                                                       // 1023
// Listen for HTTP and/or DDP traffic and route it somewhere. Only                       // 1024
// takes effect when using a proxy service.                                              // 1025
//                                                                                       // 1026
// 'url' is the traffic that we want to route, interpreted relative to                   // 1027
// the default URL where this app has been told to serve itself. It                      // 1028
// may not have a scheme or port, but it may have a host and a path,                     // 1029
// and if no host is provided the path need not be absolute. The                         // 1030
// following cases are possible:                                                         // 1031
//                                                                                       // 1032
//   //somehost.com                                                                      // 1033
//     All incoming traffic for 'somehost.com'                                           // 1034
//   //somehost.com/foo/bar                                                              // 1035
//     All incoming traffic for 'somehost.com', but only when                            // 1036
//     the first two path components are 'foo' and 'bar'.                                // 1037
//   /foo/bar                                                                            // 1038
//     Incoming traffic on our default host, but only when the                           // 1039
//     first two path components are 'foo' and 'bar'.                                    // 1040
//   foo/bar                                                                             // 1041
//     Incoming traffic on our default host, but only when the path                      // 1042
//     starts with our default path prefix, followed by 'foo' and                        // 1043
//     'bar'.                                                                            // 1044
//                                                                                       // 1045
// (Yes, these scheme-less URLs that start with '//' are legal URLs.)                    // 1046
//                                                                                       // 1047
// You can select either DDP traffic, HTTP traffic, or both. Both                        // 1048
// secure and insecure traffic will be gathered (assuming the proxy                      // 1049
// service is capable, eg, has appropriate certs and port mappings).                     // 1050
//                                                                                       // 1051
// With no 'forwardTo' option, the traffic is received by this process                   // 1052
// for service by the hooks in this 'webapp' package. The original URL                   // 1053
// is preserved (that is, if you bind "/a", and a user visits "/a/b",                    // 1054
// the app receives a request with a path of "/a/b", not a path of                       // 1055
// "/b").                                                                                // 1056
//                                                                                       // 1057
// With 'forwardTo', the process is instead sent to some other remote                    // 1058
// host. The URL is adjusted by stripping the path components in 'url'                   // 1059
// and putting the path components in the 'forwardTo' URL in their                       // 1060
// place. For example, if you forward "//somehost/a" to                                  // 1061
// "//otherhost/x", and the user types "//somehost/a/b" into their                       // 1062
// browser, then otherhost will receive a request with a Host header                     // 1063
// of "somehost" and a path of "/x/b".                                                   // 1064
//                                                                                       // 1065
// The routing continues until this process exits. For now, all of the                   // 1066
// routes must be set up ahead of time, before the initial                               // 1067
// registration with the proxy. Calling addRoute from the top level of                   // 1068
// your JS should do the trick.                                                          // 1069
//                                                                                       // 1070
// When multiple routes are present that match a given request, the                      // 1071
// most specific route wins. When routes with equal specificity are                      // 1072
// present, the proxy service will distribute the traffic between                        // 1073
// them.                                                                                 // 1074
//                                                                                       // 1075
// options may be:                                                                       // 1076
// - ddp: if true, the default, include DDP traffic. This includes                       // 1077
//   both secure and insecure traffic, and both websocket and sockjs                     // 1078
//   transports.                                                                         // 1079
// - http: if true, the default, include HTTP/HTTPS traffic.                             // 1080
// - forwardTo: if provided, should be a URL with a host, optional                       // 1081
//   path and port, and no scheme (the scheme will be derived from the                   // 1082
//   traffic type; for now it will always be a http or ws connection,                    // 1083
//   never https or wss, but we could add a forwardSecure flag to                        // 1084
//   re-encrypt).                                                                        // 1085
var routes = [];                                                                         // 1086
WebAppInternals.addRoute = function (url, options) {                                     // 1087
  options = _.extend({                                                                   // 1088
    ddp: true,                                                                           // 1089
    http: true                                                                           // 1090
  }, options || {});                                                                     // 1091
                                                                                         // 1092
  if (proxy)                                                                             // 1093
    // In the future, lift this restriction                                              // 1094
    throw new Error("Too late to add routes");                                           // 1095
                                                                                         // 1096
  routes.push(_.extend({ url: url }, options));                                          // 1097
};                                                                                       // 1098
                                                                                         // 1099
// Receive traffic on our default URL.                                                   // 1100
WebAppInternals.addRoute("");                                                            // 1101
                                                                                         // 1102
runWebAppServer();                                                                       // 1103
                                                                                         // 1104
                                                                                         // 1105
var inlineScriptsAllowed = true;                                                         // 1106
                                                                                         // 1107
WebAppInternals.inlineScriptsAllowed = function () {                                     // 1108
  return inlineScriptsAllowed;                                                           // 1109
};                                                                                       // 1110
                                                                                         // 1111
WebAppInternals.setInlineScriptsAllowed = function (value) {                             // 1112
  inlineScriptsAllowed = value;                                                          // 1113
  WebAppInternals.generateBoilerplate();                                                 // 1114
};                                                                                       // 1115
                                                                                         // 1116
WebAppInternals.setBundledJsCssPrefix = function (prefix) {                              // 1117
  bundledJsCssPrefix = prefix;                                                           // 1118
  WebAppInternals.generateBoilerplate();                                                 // 1119
};                                                                                       // 1120
                                                                                         // 1121
// Packages can call `WebAppInternals.addStaticJs` to specify static                     // 1122
// JavaScript to be included in the app. This static JS will be inlined,                 // 1123
// unless inline scripts have been disabled, in which case it will be                    // 1124
// served under `/<sha1 of contents>`.                                                   // 1125
var additionalStaticJs = {};                                                             // 1126
WebAppInternals.addStaticJs = function (contents) {                                      // 1127
  additionalStaticJs["/" + sha1(contents) + ".js"] = contents;                           // 1128
};                                                                                       // 1129
                                                                                         // 1130
// Exported for tests                                                                    // 1131
WebAppInternals.getBoilerplate = getBoilerplate;                                         // 1132
WebAppInternals.additionalStaticJs = additionalStaticJs;                                 // 1133
                                                                                         // 1134
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.webapp = {
  WebApp: WebApp,
  main: main,
  WebAppInternals: WebAppInternals
};

})();
