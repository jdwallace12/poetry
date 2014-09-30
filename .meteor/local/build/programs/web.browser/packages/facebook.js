//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var Template = Package.templating.Template;
var Random = Package.random.Random;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Facebook;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/facebook/template.facebook_configure.js                                                  //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
                                                                                                     // 1
Template.__checkName("configureLoginServiceDialogForFacebook");                                      // 2
Template["configureLoginServiceDialogForFacebook"] = new Template("Template.configureLoginServiceDialogForFacebook", (function() {
  var view = this;                                                                                   // 4
  return [ HTML.Raw("<p>\n    First, you'll need to register your app on Facebook. Follow these steps:\n  </p>\n  "), HTML.OL("\n    ", HTML.Raw('<li>\n      Visit <a href="https://developers.facebook.com/apps" target="_blank">https://developers.facebook.com/apps</a>\n    </li>'), "\n    ", HTML.Raw('<li>\n      Select "Apps", then "Create a New App". (You don\'t need to enter a namespace.)\n    </li>'), "\n    ", HTML.Raw('<li>\n      Select "Settings" and enter a "Contact Email".  Then select "Add Platform"\n      and choose "Website".\n    </li>'), "\n    ", HTML.LI("\n      Set Site URL to: ", HTML.SPAN({
    "class": "url"                                                                                   // 6
  }, Blaze.View(function() {                                                                         // 7
    return Spacebars.mustache(view.lookup("siteUrl"));                                               // 8
  })), "\n    "), "\n    ", HTML.Raw('<li>\n      Select "Status" and make the app and all its live features available to\n      the general public.\n    </li>'), "\n    ", HTML.Raw('<li>\n      Select "Dashboard".\n    </li>'), "\n  ") ];
}));                                                                                                 // 10
                                                                                                     // 11
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/facebook/facebook_configure.js                                                           //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
Template.configureLoginServiceDialogForFacebook.siteUrl = function () {                              // 1
  return Meteor.absoluteUrl();                                                                       // 2
};                                                                                                   // 3
                                                                                                     // 4
Template.configureLoginServiceDialogForFacebook.fields = function () {                               // 5
  return [                                                                                           // 6
    {property: 'appId', label: 'App ID'},                                                            // 7
    {property: 'secret', label: 'App Secret'}                                                        // 8
  ];                                                                                                 // 9
};                                                                                                   // 10
                                                                                                     // 11
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/facebook/facebook_client.js                                                              //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
Facebook = {};                                                                                       // 1
                                                                                                     // 2
// Request Facebook credentials for the user                                                         // 3
//                                                                                                   // 4
// @param options {optional}                                                                         // 5
// @param credentialRequestCompleteCallback {Function} Callback function to call on                  // 6
//   completion. Takes one argument, credentialToken on success, or Error on                         // 7
//   error.                                                                                          // 8
Facebook.requestCredential = function (options, credentialRequestCompleteCallback) {                 // 9
  // support both (options, callback) and (callback).                                                // 10
  if (!credentialRequestCompleteCallback && typeof options === 'function') {                         // 11
    credentialRequestCompleteCallback = options;                                                     // 12
    options = {};                                                                                    // 13
  }                                                                                                  // 14
                                                                                                     // 15
  var config = ServiceConfiguration.configurations.findOne({service: 'facebook'});                   // 16
  if (!config) {                                                                                     // 17
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(                          // 18
      new ServiceConfiguration.ConfigError());                                                       // 19
    return;                                                                                          // 20
  }                                                                                                  // 21
                                                                                                     // 22
  var credentialToken = Random.secret();                                                             // 23
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent); // 24
  var display = mobile ? 'touch' : 'popup';                                                          // 25
                                                                                                     // 26
  var scope = "email";                                                                               // 27
  if (options && options.requestPermissions)                                                         // 28
    scope = options.requestPermissions.join(',');                                                    // 29
                                                                                                     // 30
  var loginStyle = OAuth._loginStyle('facebook', config, options);                                   // 31
                                                                                                     // 32
  var loginUrl =                                                                                     // 33
        'https://www.facebook.com/dialog/oauth?client_id=' + config.appId +                          // 34
        '&redirect_uri=' + OAuth._redirectUri('facebook', config) +                                  // 35
        '&display=' + display + '&scope=' + scope +                                                  // 36
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);                                  // 37
                                                                                                     // 38
  OAuth.launchLogin({                                                                                // 39
    loginService: "facebook",                                                                        // 40
    loginStyle: loginStyle,                                                                          // 41
    loginUrl: loginUrl,                                                                              // 42
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,                            // 43
    credentialToken: credentialToken                                                                 // 44
  });                                                                                                // 45
};                                                                                                   // 46
                                                                                                     // 47
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.facebook = {
  Facebook: Facebook
};

})();
