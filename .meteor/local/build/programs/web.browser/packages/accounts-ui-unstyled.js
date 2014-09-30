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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;
var Template = Package.templating.Template;
var Session = Package.session.Session;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var passwordSignupFields, displayName, getLoginServices, hasPasswordService, dropdown, validateUsername, validateEmail, validatePassword;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/accounts_ui.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * @summary Accounts UI                                                                                                // 2
 * @namespace                                                                                                          // 3
 * @memberOf Accounts                                                                                                  // 4
 */                                                                                                                    // 5
Accounts.ui = {};                                                                                                      // 6
                                                                                                                       // 7
Accounts.ui._options = {                                                                                               // 8
  requestPermissions: {},                                                                                              // 9
  requestOfflineToken: {},                                                                                             // 10
  forceApprovalPrompt: {}                                                                                              // 11
};                                                                                                                     // 12
                                                                                                                       // 13
// XXX refactor duplicated code in this function                                                                       // 14
                                                                                                                       // 15
/**                                                                                                                    // 16
 * @summary Configure the behavior of [`{{> loginButtons}}`](#accountsui).                                             // 17
 * @locus Client                                                                                                       // 18
 * @param {Object} options                                                                                             // 19
 * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
 * @param {Boolean} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', or '`EMAIL_ONLY`' (default).
 */                                                                                                                    // 24
Accounts.ui.config = function(options) {                                                                               // 25
  // validate options keys                                                                                             // 26
  var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt'];       // 27
  _.each(_.keys(options), function (key) {                                                                             // 28
    if (!_.contains(VALID_KEYS, key))                                                                                  // 29
      throw new Error("Accounts.ui.config: Invalid key: " + key);                                                      // 30
  });                                                                                                                  // 31
                                                                                                                       // 32
  // deal with `passwordSignupFields`                                                                                  // 33
  if (options.passwordSignupFields) {                                                                                  // 34
    if (_.contains([                                                                                                   // 35
      "USERNAME_AND_EMAIL",                                                                                            // 36
      "USERNAME_AND_OPTIONAL_EMAIL",                                                                                   // 37
      "USERNAME_ONLY",                                                                                                 // 38
      "EMAIL_ONLY"                                                                                                     // 39
    ], options.passwordSignupFields)) {                                                                                // 40
      if (Accounts.ui._options.passwordSignupFields)                                                                   // 41
        throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");                        // 42
      else                                                                                                             // 43
        Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;                                      // 44
    } else {                                                                                                           // 45
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }                                                                                                                  // 47
  }                                                                                                                    // 48
                                                                                                                       // 49
  // deal with `requestPermissions`                                                                                    // 50
  if (options.requestPermissions) {                                                                                    // 51
    _.each(options.requestPermissions, function (scope, service) {                                                     // 52
      if (Accounts.ui._options.requestPermissions[service]) {                                                          // 53
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);           // 54
      } else if (!(scope instanceof Array)) {                                                                          // 55
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");                        // 56
      } else {                                                                                                         // 57
        Accounts.ui._options.requestPermissions[service] = scope;                                                      // 58
      }                                                                                                                // 59
    });                                                                                                                // 60
  }                                                                                                                    // 61
                                                                                                                       // 62
  // deal with `requestOfflineToken`                                                                                   // 63
  if (options.requestOfflineToken) {                                                                                   // 64
    _.each(options.requestOfflineToken, function (value, service) {                                                    // 65
      if (service !== 'google')                                                                                        // 66
        throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");   // 67
                                                                                                                       // 68
      if (Accounts.ui._options.requestOfflineToken[service]) {                                                         // 69
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);          // 70
      } else {                                                                                                         // 71
        Accounts.ui._options.requestOfflineToken[service] = value;                                                     // 72
      }                                                                                                                // 73
    });                                                                                                                // 74
  }                                                                                                                    // 75
                                                                                                                       // 76
  // deal with `forceApprovalPrompt`                                                                                   // 77
  if (options.forceApprovalPrompt) {                                                                                   // 78
    _.each(options.forceApprovalPrompt, function (value, service) {                                                    // 79
      if (service !== 'google')                                                                                        // 80
        throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");   // 81
                                                                                                                       // 82
      if (Accounts.ui._options.forceApprovalPrompt[service]) {                                                         // 83
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);          // 84
      } else {                                                                                                         // 85
        Accounts.ui._options.forceApprovalPrompt[service] = value;                                                     // 86
      }                                                                                                                // 87
    });                                                                                                                // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
passwordSignupFields = function () {                                                                                   // 92
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";                                                    // 93
};                                                                                                                     // 94
                                                                                                                       // 95
                                                                                                                       // 96
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("loginButtons");                                                                                  // 2
Template["loginButtons"] = new Template("Template.loginButtons", (function() {                                         // 3
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    id: "login-buttons",                                                                                               // 6
    "class": function() {                                                                                              // 7
      return [ "login-buttons-dropdown-align-", Spacebars.mustache(view.lookup("align")) ];                            // 8
    }                                                                                                                  // 9
  }, "\n    ", Blaze.If(function() {                                                                                   // 10
    return Spacebars.call(view.lookup("currentUser"));                                                                 // 11
  }, function() {                                                                                                      // 12
    return [ "\n      ", Blaze.If(function() {                                                                         // 13
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 14
    }, function() {                                                                                                    // 15
      return [ "\n        \n        ", Blaze.If(function() {                                                           // 16
        return Spacebars.call(view.lookup("dropdown"));                                                                // 17
      }, function() {                                                                                                  // 18
        return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n        " ];     // 19
      }, function() {                                                                                                  // 20
        return [ "\n          ", HTML.DIV({                                                                            // 21
          "class": "login-buttons-with-only-one-button"                                                                // 22
        }, "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n          "), "\n        " ];
      }), "\n      " ];                                                                                                // 24
    }, function() {                                                                                                    // 25
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedIn")), "\n      " ];            // 26
    }), "\n    " ];                                                                                                    // 27
  }, function() {                                                                                                      // 28
    return [ "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOut")), "\n    " ];                 // 29
  }), "\n  ");                                                                                                         // 30
}));                                                                                                                   // 31
                                                                                                                       // 32
Template.__checkName("_loginButtonsLoggedIn");                                                                         // 33
Template["_loginButtonsLoggedIn"] = new Template("Template._loginButtonsLoggedIn", (function() {                       // 34
  var view = this;                                                                                                     // 35
  return Blaze.If(function() {                                                                                         // 36
    return Spacebars.call(view.lookup("dropdown"));                                                                    // 37
  }, function() {                                                                                                      // 38
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdown")), "\n  " ];              // 39
  }, function() {                                                                                                      // 40
    return [ "\n    ", HTML.DIV({                                                                                      // 41
      "class": "login-buttons-with-only-one-button"                                                                    // 42
    }, "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInSingleLogoutButton")), "\n    "), "\n  " ];
  });                                                                                                                  // 44
}));                                                                                                                   // 45
                                                                                                                       // 46
Template.__checkName("_loginButtonsLoggedOut");                                                                        // 47
Template["_loginButtonsLoggedOut"] = new Template("Template._loginButtonsLoggedOut", (function() {                     // 48
  var view = this;                                                                                                     // 49
  return Blaze.If(function() {                                                                                         // 50
    return Spacebars.call(view.lookup("services"));                                                                    // 51
  }, function() {                                                                                                      // 52
    return [ " \n    ", Blaze.If(function() {                                                                          // 53
      return Spacebars.call(view.lookup("configurationLoaded"));                                                       // 54
    }, function() {                                                                                                    // 55
      return [ "\n      ", Blaze.If(function() {                                                                       // 56
        return Spacebars.call(view.lookup("dropdown"));                                                                // 57
      }, function() {                                                                                                  // 58
        return [ " \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutDropdown")), "\n      " ];
      }, function() {                                                                                                  // 60
        return [ "\n        ", Spacebars.With(function() {                                                             // 61
          return Spacebars.call(view.lookup("singleService"));                                                         // 62
        }, function() {                                                                                                // 63
          return [ " \n          ", HTML.DIV({                                                                         // 64
            "class": "login-buttons-with-only-one-button"                                                              // 65
          }, "\n            ", Blaze.If(function() {                                                                   // 66
            return Spacebars.call(view.lookup("loggingIn"));                                                           // 67
          }, function() {                                                                                              // 68
            return [ "\n              ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n            " ];
          }, function() {                                                                                              // 70
            return [ "\n              ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n            " ];
          }), "\n          "), "\n        " ];                                                                         // 72
        }), "\n      " ];                                                                                              // 73
      }), "\n    " ];                                                                                                  // 74
    }), "\n  " ];                                                                                                      // 75
  }, function() {                                                                                                      // 76
    return [ "\n    ", HTML.DIV({                                                                                      // 77
      "class": "no-services"                                                                                           // 78
    }, "No login services configured"), "\n  " ];                                                                      // 79
  });                                                                                                                  // 80
}));                                                                                                                   // 81
                                                                                                                       // 82
Template.__checkName("_loginButtonsMessages");                                                                         // 83
Template["_loginButtonsMessages"] = new Template("Template._loginButtonsMessages", (function() {                       // 84
  var view = this;                                                                                                     // 85
  return [ Blaze.If(function() {                                                                                       // 86
    return Spacebars.call(view.lookup("errorMessage"));                                                                // 87
  }, function() {                                                                                                      // 88
    return [ "\n    ", HTML.DIV({                                                                                      // 89
      "class": "message error-message"                                                                                 // 90
    }, Blaze.View(function() {                                                                                         // 91
      return Spacebars.mustache(view.lookup("errorMessage"));                                                          // 92
    })), "\n  " ];                                                                                                     // 93
  }), "\n  ", Blaze.If(function() {                                                                                    // 94
    return Spacebars.call(view.lookup("infoMessage"));                                                                 // 95
  }, function() {                                                                                                      // 96
    return [ "\n    ", HTML.DIV({                                                                                      // 97
      "class": "message info-message"                                                                                  // 98
    }, Blaze.View(function() {                                                                                         // 99
      return Spacebars.mustache(view.lookup("infoMessage"));                                                           // 100
    })), "\n  " ];                                                                                                     // 101
  }) ];                                                                                                                // 102
}));                                                                                                                   // 103
                                                                                                                       // 104
Template.__checkName("_loginButtonsLoggingIn");                                                                        // 105
Template["_loginButtonsLoggingIn"] = new Template("Template._loginButtonsLoggingIn", (function() {                     // 106
  var view = this;                                                                                                     // 107
  return [ Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInPadding")), HTML.Raw('\n  <div class="loading">&nbsp;</div>\n  '), Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInPadding")) ];
}));                                                                                                                   // 109
                                                                                                                       // 110
Template.__checkName("_loginButtonsLoggingInPadding");                                                                 // 111
Template["_loginButtonsLoggingInPadding"] = new Template("Template._loginButtonsLoggingInPadding", (function() {       // 112
  var view = this;                                                                                                     // 113
  return Blaze.Unless(function() {                                                                                     // 114
    return Spacebars.call(view.lookup("dropdown"));                                                                    // 115
  }, function() {                                                                                                      // 116
    return [ "\n    \n    ", HTML.DIV({                                                                                // 117
      "class": "login-buttons-padding"                                                                                 // 118
    }, "\n      ", HTML.DIV({                                                                                          // 119
      "class": "login-button single-login-button",                                                                     // 120
      style: "visibility: hidden;",                                                                                    // 121
      id: "login-buttons-logout"                                                                                       // 122
    }, HTML.CharRef({                                                                                                  // 123
      html: "&nbsp;",                                                                                                  // 124
      str: " "                                                                                                         // 125
    })), "\n    "), "\n  " ];                                                                                          // 126
  }, function() {                                                                                                      // 127
    return [ "\n    \n    ", HTML.DIV({                                                                                // 128
      "class": "login-buttons-padding"                                                                                 // 129
    }), "\n  " ];                                                                                                      // 130
  });                                                                                                                  // 131
}));                                                                                                                   // 132
                                                                                                                       // 133
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_single.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("_loginButtonsLoggedOutSingleLoginButton");                                                       // 2
Template["_loginButtonsLoggedOutSingleLoginButton"] = new Template("Template._loginButtonsLoggedOutSingleLoginButton", (function() {
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    "class": "login-text-and-button"                                                                                   // 6
  }, "\n    ", HTML.DIV({                                                                                              // 7
    "class": function() {                                                                                              // 8
      return [ "login-button single-login-button ", Blaze.Unless(function() {                                          // 9
        return Spacebars.call(view.lookup("configured"));                                                              // 10
      }, function() {                                                                                                  // 11
        return "configure-button";                                                                                     // 12
      }) ];                                                                                                            // 13
    },                                                                                                                 // 14
    id: function() {                                                                                                   // 15
      return [ "login-buttons-", Spacebars.mustache(view.lookup("name")) ];                                            // 16
    }                                                                                                                  // 17
  }, "\n      ", HTML.DIV({                                                                                            // 18
    "class": "login-image",                                                                                            // 19
    id: function() {                                                                                                   // 20
      return [ "login-buttons-image-", Spacebars.mustache(view.lookup("name")) ];                                      // 21
    }                                                                                                                  // 22
  }), "\n      ", Blaze.If(function() {                                                                                // 23
    return Spacebars.call(view.lookup("configured"));                                                                  // 24
  }, function() {                                                                                                      // 25
    return [ "\n        ", HTML.SPAN({                                                                                 // 26
      "class": function() {                                                                                            // 27
        return [ "text-besides-image sign-in-text-", Spacebars.mustache(view.lookup("name")) ];                        // 28
      }                                                                                                                // 29
    }, "Sign in with ", Blaze.View(function() {                                                                        // 30
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 31
    })), "\n      " ];                                                                                                 // 32
  }, function() {                                                                                                      // 33
    return [ "\n        ", HTML.SPAN({                                                                                 // 34
      "class": function() {                                                                                            // 35
        return [ "text-besides-image configure-text-", Spacebars.mustache(view.lookup("name")) ];                      // 36
      }                                                                                                                // 37
    }, "Configure ", Blaze.View(function() {                                                                           // 38
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 39
    }), " Login"), "\n      " ];                                                                                       // 40
  }), "\n    "), "\n  ");                                                                                              // 41
}));                                                                                                                   // 42
                                                                                                                       // 43
Template.__checkName("_loginButtonsLoggingInSingleLoginButton");                                                       // 44
Template["_loginButtonsLoggingInSingleLoginButton"] = new Template("Template._loginButtonsLoggingInSingleLoginButton", (function() {
  var view = this;                                                                                                     // 46
  return HTML.DIV({                                                                                                    // 47
    "class": "login-text-and-button"                                                                                   // 48
  }, "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n  ");                              // 49
}));                                                                                                                   // 50
                                                                                                                       // 51
Template.__checkName("_loginButtonsLoggedInSingleLogoutButton");                                                       // 52
Template["_loginButtonsLoggedInSingleLogoutButton"] = new Template("Template._loginButtonsLoggedInSingleLogoutButton", (function() {
  var view = this;                                                                                                     // 54
  return HTML.DIV({                                                                                                    // 55
    "class": "login-text-and-button"                                                                                   // 56
  }, "\n    ", HTML.DIV({                                                                                              // 57
    "class": "login-display-name"                                                                                      // 58
  }, "\n      ", Blaze.View(function() {                                                                               // 59
    return Spacebars.mustache(view.lookup("displayName"));                                                             // 60
  }), "\n    "), HTML.Raw('\n    <div class="login-button single-login-button" id="login-buttons-logout">Sign Out</div>\n  '));
}));                                                                                                                   // 62
                                                                                                                       // 63
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_dropdown.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("_loginButtonsLoggedInDropdown");                                                                 // 2
Template["_loginButtonsLoggedInDropdown"] = new Template("Template._loginButtonsLoggedInDropdown", (function() {       // 3
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    "class": "login-link-and-dropdown-list"                                                                            // 6
  }, "\n    ", HTML.A({                                                                                                // 7
    "class": "login-link-text",                                                                                        // 8
    id: "login-name-link"                                                                                              // 9
  }, "\n      ", Blaze.View(function() {                                                                               // 10
    return Spacebars.mustache(view.lookup("displayName"));                                                             // 11
  }), " ▾\n    "), "\n\n    ", Blaze.If(function() {                                                                   // 12
    return Spacebars.call(view.lookup("dropdownVisible"));                                                             // 13
  }, function() {                                                                                                      // 14
    return [ "\n      ", HTML.DIV({                                                                                    // 15
      id: "login-dropdown-list",                                                                                       // 16
      "class": "accounts-dialog"                                                                                       // 17
    }, "\n        ", HTML.A({                                                                                          // 18
      "class": "login-close-text"                                                                                      // 19
    }, "Close"), "\n        ", HTML.DIV({                                                                              // 20
      "class": "login-close-text-clear"                                                                                // 21
    }), "\n\n        ", Blaze.If(function() {                                                                          // 22
      return Spacebars.call(view.lookup("inMessageOnlyFlow"));                                                         // 23
    }, function() {                                                                                                    // 24
      return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n        " ];        // 25
    }, function() {                                                                                                    // 26
      return [ "\n          ", Blaze.If(function() {                                                                   // 27
        return Spacebars.call(view.lookup("inChangePasswordFlow"));                                                    // 28
      }, function() {                                                                                                  // 29
        return [ "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsChangePassword")), "\n          " ];
      }, function() {                                                                                                  // 31
        return [ "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdownActions")), "\n          " ];
      }), "\n        " ];                                                                                              // 33
    }), "\n      "), "\n    " ];                                                                                       // 34
  }), "\n  ");                                                                                                         // 35
}));                                                                                                                   // 36
                                                                                                                       // 37
Template.__checkName("_loginButtonsLoggedInDropdownActions");                                                          // 38
Template["_loginButtonsLoggedInDropdownActions"] = new Template("Template._loginButtonsLoggedInDropdownActions", (function() {
  var view = this;                                                                                                     // 40
  return [ Blaze.If(function() {                                                                                       // 41
    return Spacebars.call(view.lookup("allowChangingPassword"));                                                       // 42
  }, function() {                                                                                                      // 43
    return [ "\n    ", HTML.DIV({                                                                                      // 44
      "class": "login-button",                                                                                         // 45
      id: "login-buttons-open-change-password"                                                                         // 46
    }, "\n      Change password\n    "), "\n  " ];                                                                     // 47
  }), HTML.Raw('\n\n  <div class="login-button" id="login-buttons-logout">\n    Sign out\n  </div>\n\n  '), Spacebars.include(view.lookupTemplate("_loginButtonsMessages")) ];
}));                                                                                                                   // 49
                                                                                                                       // 50
Template.__checkName("_loginButtonsLoggedOutDropdown");                                                                // 51
Template["_loginButtonsLoggedOutDropdown"] = new Template("Template._loginButtonsLoggedOutDropdown", (function() {     // 52
  var view = this;                                                                                                     // 53
  return HTML.DIV({                                                                                                    // 54
    "class": function() {                                                                                              // 55
      return [ "login-link-and-dropdown-list ", Spacebars.mustache(view.lookup("additionalClasses")) ];                // 56
    }                                                                                                                  // 57
  }, "\n    ", Blaze.If(function() {                                                                                   // 58
    return Spacebars.call(view.lookup("dropdownVisible"));                                                             // 59
  }, function() {                                                                                                      // 60
    return [ "\n      \n      ", HTML.A({                                                                              // 61
      "class": "login-link-text",                                                                                      // 62
      id: "login-sign-in-link"                                                                                         // 63
    }, "Sign in ▾"), "\n      ", HTML.DIV({                                                                            // 64
      id: "login-dropdown-list",                                                                                       // 65
      "class": "accounts-dialog"                                                                                       // 66
    }, "\n        ", HTML.A({                                                                                          // 67
      "class": "login-close-text"                                                                                      // 68
    }, "Close"), "\n        ", Blaze.If(function() {                                                                   // 69
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 70
    }, function() {                                                                                                    // 71
      return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n        " ];       // 72
    }), "\n        ", HTML.DIV({                                                                                       // 73
      "class": "login-close-text-clear"                                                                                // 74
    }), "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutAllServices")), "\n      "), "\n    " ];
  }, function() {                                                                                                      // 76
    return [ "\n      ", Blaze.If(function() {                                                                         // 77
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 78
    }, function() {                                                                                                    // 79
      return [ "\n        \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n      " ]; // 80
    }, function() {                                                                                                    // 81
      return [ "\n        ", HTML.A({                                                                                  // 82
        "class": "login-link-text",                                                                                    // 83
        id: "login-sign-in-link"                                                                                       // 84
      }, "Sign in ▾"), "\n      " ];                                                                                   // 85
    }), "\n    " ];                                                                                                    // 86
  }), "\n  ");                                                                                                         // 87
}));                                                                                                                   // 88
                                                                                                                       // 89
Template.__checkName("_loginButtonsLoggedOutAllServices");                                                             // 90
Template["_loginButtonsLoggedOutAllServices"] = new Template("Template._loginButtonsLoggedOutAllServices", (function() {
  var view = this;                                                                                                     // 92
  return [ Blaze.Each(function() {                                                                                     // 93
    return Spacebars.call(view.lookup("services"));                                                                    // 94
  }, function() {                                                                                                      // 95
    return [ "\n    ", Blaze.If(function() {                                                                           // 96
      return Spacebars.call(view.lookup("isPasswordService"));                                                         // 97
    }, function() {                                                                                                    // 98
      return [ "\n      ", Blaze.If(function() {                                                                       // 99
        return Spacebars.call(view.lookup("hasOtherServices"));                                                        // 100
      }, function() {                                                                                                  // 101
        return [ " \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordServiceSeparator")), "\n      " ];
      }), "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordService")), "\n    " ];     // 103
    }, function() {                                                                                                    // 104
      return [ "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n    " ];
    }), "\n  " ];                                                                                                      // 106
  }), "\n\n  ", Blaze.Unless(function() {                                                                              // 107
    return Spacebars.call(view.lookup("hasPasswordService"));                                                          // 108
  }, function() {                                                                                                      // 109
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n  " ];                      // 110
  }) ];                                                                                                                // 111
}));                                                                                                                   // 112
                                                                                                                       // 113
Template.__checkName("_loginButtonsLoggedOutPasswordServiceSeparator");                                                // 114
Template["_loginButtonsLoggedOutPasswordServiceSeparator"] = new Template("Template._loginButtonsLoggedOutPasswordServiceSeparator", (function() {
  var view = this;                                                                                                     // 116
  return HTML.Raw('<div class="or">\n    <span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n    <span class="or-text">or</span>\n    <span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n  </div>');
}));                                                                                                                   // 118
                                                                                                                       // 119
Template.__checkName("_loginButtonsLoggedOutPasswordService");                                                         // 120
Template["_loginButtonsLoggedOutPasswordService"] = new Template("Template._loginButtonsLoggedOutPasswordService", (function() {
  var view = this;                                                                                                     // 122
  return Blaze.If(function() {                                                                                         // 123
    return Spacebars.call(view.lookup("inForgotPasswordFlow"));                                                        // 124
  }, function() {                                                                                                      // 125
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_forgotPasswordForm")), "\n  " ];                        // 126
  }, function() {                                                                                                      // 127
    return [ "\n    ", HTML.DIV({                                                                                      // 128
      "class": "login-form login-password-form"                                                                        // 129
    }, "\n      ", Blaze.Each(function() {                                                                             // 130
      return Spacebars.call(view.lookup("fields"));                                                                    // 131
    }, function() {                                                                                                    // 132
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n      " ];           // 133
    }), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({        // 134
      "class": "login-button login-button-form-submit",                                                                // 135
      id: "login-buttons-password"                                                                                     // 136
    }, "\n        ", Blaze.If(function() {                                                                             // 137
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 138
    }, function() {                                                                                                    // 139
      return "\n          Create account\n        ";                                                                   // 140
    }, function() {                                                                                                    // 141
      return "\n          Sign in\n        ";                                                                          // 142
    }), "\n      "), "\n\n      ", Blaze.If(function() {                                                               // 143
      return Spacebars.call(view.lookup("inLoginFlow"));                                                               // 144
    }, function() {                                                                                                    // 145
      return [ "\n        ", Blaze.If(function() {                                                                     // 146
        return Spacebars.call(view.lookup("showCreateAccountLink"));                                                   // 147
      }, function() {                                                                                                  // 148
        return [ "\n          ", HTML.DIV({                                                                            // 149
          "class": "additional-link-container"                                                                         // 150
        }, "\n            ", HTML.A({                                                                                  // 151
          id: "signup-link",                                                                                           // 152
          "class": "additional-link"                                                                                   // 153
        }, "Create account"), "\n          "), "\n        " ];                                                         // 154
      }), "\n\n        ", Blaze.If(function() {                                                                        // 155
        return Spacebars.call(view.lookup("showForgotPasswordLink"));                                                  // 156
      }, function() {                                                                                                  // 157
        return [ "\n          ", HTML.DIV({                                                                            // 158
          "class": "additional-link-container"                                                                         // 159
        }, "\n            ", HTML.A({                                                                                  // 160
          id: "forgot-password-link",                                                                                  // 161
          "class": "additional-link"                                                                                   // 162
        }, "Forgot password"), "\n          "), "\n        " ];                                                        // 163
      }), "\n      " ];                                                                                                // 164
    }), "\n\n      ", Blaze.If(function() {                                                                            // 165
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 166
    }, function() {                                                                                                    // 167
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n      " ];     // 168
    }), "\n    "), "\n  " ];                                                                                           // 169
  });                                                                                                                  // 170
}));                                                                                                                   // 171
                                                                                                                       // 172
Template.__checkName("_forgotPasswordForm");                                                                           // 173
Template["_forgotPasswordForm"] = new Template("Template._forgotPasswordForm", (function() {                           // 174
  var view = this;                                                                                                     // 175
  return HTML.DIV({                                                                                                    // 176
    "class": "login-form"                                                                                              // 177
  }, HTML.Raw('\n    <div id="forgot-password-email-label-and-input"> \n      <label id="forgot-password-email-label" for="forgot-password-email">Email</label>\n      <input id="forgot-password-email" type="email">\n    </div>\n\n    '), Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), HTML.Raw('\n\n    <div class="login-button login-button-form-submit" id="login-buttons-forgot-password">\n      Reset password\n    </div>\n\n    '), Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n  ");
}));                                                                                                                   // 179
                                                                                                                       // 180
Template.__checkName("_loginButtonsBackToLoginLink");                                                                  // 181
Template["_loginButtonsBackToLoginLink"] = new Template("Template._loginButtonsBackToLoginLink", (function() {         // 182
  var view = this;                                                                                                     // 183
  return HTML.Raw('<div class="additional-link-container">\n    <a id="back-to-login-link" class="additional-link">Sign in</a>\n  </div>');
}));                                                                                                                   // 185
                                                                                                                       // 186
Template.__checkName("_loginButtonsFormField");                                                                        // 187
Template["_loginButtonsFormField"] = new Template("Template._loginButtonsFormField", (function() {                     // 188
  var view = this;                                                                                                     // 189
  return Blaze.If(function() {                                                                                         // 190
    return Spacebars.call(view.lookup("visible"));                                                                     // 191
  }, function() {                                                                                                      // 192
    return [ "\n    ", HTML.DIV({                                                                                      // 193
      id: function() {                                                                                                 // 194
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")), "-label-and-input" ];                         // 195
      }                                                                                                                // 196
    }, "\n      ", HTML.LABEL({                                                                                        // 197
      id: function() {                                                                                                 // 198
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")), "-label" ];                                   // 199
      },                                                                                                               // 200
      "for": function() {                                                                                              // 201
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                             // 202
      }                                                                                                                // 203
    }, "\n        ", Blaze.View(function() {                                                                           // 204
      return Spacebars.mustache(view.lookup("fieldLabel"));                                                            // 205
    }), "\n      "), "\n      ", HTML.INPUT({                                                                          // 206
      id: function() {                                                                                                 // 207
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                             // 208
      },                                                                                                               // 209
      type: function() {                                                                                               // 210
        return Spacebars.mustache(view.lookup("inputType"));                                                           // 211
      }                                                                                                                // 212
    }), "\n    "), "\n  " ];                                                                                           // 213
  });                                                                                                                  // 214
}));                                                                                                                   // 215
                                                                                                                       // 216
Template.__checkName("_loginButtonsChangePassword");                                                                   // 217
Template["_loginButtonsChangePassword"] = new Template("Template._loginButtonsChangePassword", (function() {           // 218
  var view = this;                                                                                                     // 219
  return [ Blaze.Each(function() {                                                                                     // 220
    return Spacebars.call(view.lookup("fields"));                                                                      // 221
  }, function() {                                                                                                      // 222
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n  " ];                     // 223
  }), "\n\n  ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), HTML.Raw('\n\n  <div class="login-button login-button-form-submit" id="login-buttons-do-change-password">\n    Change password\n  </div>') ];
}));                                                                                                                   // 225
                                                                                                                       // 226
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_dialogs.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.body.addContent((function() {                                                                                 // 2
  var view = this;                                                                                                     // 3
  return [ Spacebars.include(view.lookupTemplate("_resetPasswordDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_justResetPasswordDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_enrollAccountDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_justVerifiedEmailDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_configureLoginServiceDialog")), HTML.Raw("\n\n  <!-- if we're not showing a dropdown, we need some other place to show messages -->\n  "), Spacebars.include(view.lookupTemplate("_loginButtonsMessagesDialog")) ];
}));                                                                                                                   // 5
Meteor.startup(Template.body.renderToDocument);                                                                        // 6
                                                                                                                       // 7
Template.__checkName("_resetPasswordDialog");                                                                          // 8
Template["_resetPasswordDialog"] = new Template("Template._resetPasswordDialog", (function() {                         // 9
  var view = this;                                                                                                     // 10
  return Blaze.If(function() {                                                                                         // 11
    return Spacebars.call(view.lookup("inResetPasswordFlow"));                                                         // 12
  }, function() {                                                                                                      // 13
    return [ "\n    ", HTML.DIV({                                                                                      // 14
      "class": "hide-background"                                                                                       // 15
    }), "\n\n    ", HTML.DIV({                                                                                         // 16
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 17
    }, "\n      ", HTML.LABEL({                                                                                        // 18
      id: "reset-password-new-password-label",                                                                         // 19
      "for": "reset-password-new-password"                                                                             // 20
    }, "\n        New password\n      "), "\n\n      ", HTML.DIV({                                                     // 21
      "class": "reset-password-new-password-wrapper"                                                                   // 22
    }, "\n        ", HTML.INPUT({                                                                                      // 23
      id: "reset-password-new-password",                                                                               // 24
      type: "password"                                                                                                 // 25
    }), "\n      "), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({
      "class": "login-button login-button-form-submit",                                                                // 27
      id: "login-buttons-reset-password-button"                                                                        // 28
    }, "\n        Set password\n      "), "\n\n      ", HTML.A({                                                       // 29
      "class": "accounts-close",                                                                                       // 30
      id: "login-buttons-cancel-reset-password"                                                                        // 31
    }, HTML.CharRef({                                                                                                  // 32
      html: "&times;",                                                                                                 // 33
      str: "×"                                                                                                         // 34
    })), "\n    "), "\n  " ];                                                                                          // 35
  });                                                                                                                  // 36
}));                                                                                                                   // 37
                                                                                                                       // 38
Template.__checkName("_justResetPasswordDialog");                                                                      // 39
Template["_justResetPasswordDialog"] = new Template("Template._justResetPasswordDialog", (function() {                 // 40
  var view = this;                                                                                                     // 41
  return Blaze.If(function() {                                                                                         // 42
    return Spacebars.call(view.lookup("visible"));                                                                     // 43
  }, function() {                                                                                                      // 44
    return [ "\n    ", HTML.DIV({                                                                                      // 45
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 46
    }, "\n      Password reset.\n      You are now logged in as ", Blaze.View(function() {                             // 47
      return Spacebars.mustache(view.lookup("displayName"));                                                           // 48
    }), ".\n      ", HTML.DIV({                                                                                        // 49
      "class": "login-button",                                                                                         // 50
      id: "just-verified-dismiss-button"                                                                               // 51
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 52
  });                                                                                                                  // 53
}));                                                                                                                   // 54
                                                                                                                       // 55
Template.__checkName("_enrollAccountDialog");                                                                          // 56
Template["_enrollAccountDialog"] = new Template("Template._enrollAccountDialog", (function() {                         // 57
  var view = this;                                                                                                     // 58
  return Blaze.If(function() {                                                                                         // 59
    return Spacebars.call(view.lookup("inEnrollAccountFlow"));                                                         // 60
  }, function() {                                                                                                      // 61
    return [ "\n    ", HTML.DIV({                                                                                      // 62
      "class": "hide-background"                                                                                       // 63
    }), "\n\n    ", HTML.DIV({                                                                                         // 64
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 65
    }, "\n      ", HTML.LABEL({                                                                                        // 66
      id: "enroll-account-password-label",                                                                             // 67
      "for": "enroll-account-password"                                                                                 // 68
    }, "\n        Choose a password\n      "), "\n\n      ", HTML.DIV({                                                // 69
      "class": "enroll-account-password-wrapper"                                                                       // 70
    }, "\n        ", HTML.INPUT({                                                                                      // 71
      id: "enroll-account-password",                                                                                   // 72
      type: "password"                                                                                                 // 73
    }), "\n      "), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({
      "class": "login-button login-button-form-submit",                                                                // 75
      id: "login-buttons-enroll-account-button"                                                                        // 76
    }, "\n        Create account\n      "), "\n\n      ", HTML.A({                                                     // 77
      "class": "accounts-close",                                                                                       // 78
      id: "login-buttons-cancel-enroll-account"                                                                        // 79
    }, HTML.CharRef({                                                                                                  // 80
      html: "&times;",                                                                                                 // 81
      str: "×"                                                                                                         // 82
    })), "\n    "), "\n  " ];                                                                                          // 83
  });                                                                                                                  // 84
}));                                                                                                                   // 85
                                                                                                                       // 86
Template.__checkName("_justVerifiedEmailDialog");                                                                      // 87
Template["_justVerifiedEmailDialog"] = new Template("Template._justVerifiedEmailDialog", (function() {                 // 88
  var view = this;                                                                                                     // 89
  return Blaze.If(function() {                                                                                         // 90
    return Spacebars.call(view.lookup("visible"));                                                                     // 91
  }, function() {                                                                                                      // 92
    return [ "\n    ", HTML.DIV({                                                                                      // 93
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 94
    }, "\n      Email verified.\n      You are now logged in as ", Blaze.View(function() {                             // 95
      return Spacebars.mustache(view.lookup("displayName"));                                                           // 96
    }), ".\n      ", HTML.DIV({                                                                                        // 97
      "class": "login-button",                                                                                         // 98
      id: "just-verified-dismiss-button"                                                                               // 99
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 100
  });                                                                                                                  // 101
}));                                                                                                                   // 102
                                                                                                                       // 103
Template.__checkName("_configureLoginServiceDialog");                                                                  // 104
Template["_configureLoginServiceDialog"] = new Template("Template._configureLoginServiceDialog", (function() {         // 105
  var view = this;                                                                                                     // 106
  return Blaze.If(function() {                                                                                         // 107
    return Spacebars.call(view.lookup("visible"));                                                                     // 108
  }, function() {                                                                                                      // 109
    return [ "\n    ", HTML.DIV({                                                                                      // 110
      id: "configure-login-service-dialog",                                                                            // 111
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 112
    }, "\n      ", Spacebars.include(view.lookupTemplate("configurationSteps")), "\n\n      ", HTML.P("\n        Now, copy over some details.\n      "), "\n      ", HTML.P("\n        ", HTML.TABLE("\n          ", HTML.COLGROUP("\n            ", HTML.COL({
      span: "1",                                                                                                       // 114
      "class": "configuration_labels"                                                                                  // 115
    }), "\n            ", HTML.COL({                                                                                   // 116
      span: "1",                                                                                                       // 117
      "class": "configuration_inputs"                                                                                  // 118
    }), "\n          "), "\n          ", Blaze.Each(function() {                                                       // 119
      return Spacebars.call(view.lookup("configurationFields"));                                                       // 120
    }, function() {                                                                                                    // 121
      return [ "\n            ", HTML.TR("\n              ", HTML.TD("\n                ", HTML.LABEL({                // 122
        "for": function() {                                                                                            // 123
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 124
        }                                                                                                              // 125
      }, Blaze.View(function() {                                                                                       // 126
        return Spacebars.mustache(view.lookup("label"));                                                               // 127
      })), "\n              "), "\n              ", HTML.TD("\n                ", HTML.INPUT({                         // 128
        id: function() {                                                                                               // 129
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 130
        },                                                                                                             // 131
        type: "text"                                                                                                   // 132
      }), "\n              "), "\n            "), "\n          " ];                                                    // 133
    }), "\n        "), "\n      "), "\n      ", HTML.P({                                                               // 134
      "class": "new-section"                                                                                           // 135
    }, "\n        Choose the login style:\n      "), "\n      ", HTML.P("\n        ", HTML.CharRef({                   // 136
      html: "&emsp;",                                                                                                  // 137
      str: " "                                                                                                         // 138
    }), HTML.INPUT({                                                                                                   // 139
      id: "configure-login-service-dialog-popupBasedLogin",                                                            // 140
      type: "radio",                                                                                                   // 141
      checked: "checked",                                                                                              // 142
      name: "loginStyle",                                                                                              // 143
      value: "popup"                                                                                                   // 144
    }), "\n        ", HTML.LABEL({                                                                                     // 145
      "for": "configure-login-service-dialog-popupBasedLogin"                                                          // 146
    }, "Popup-based login (recommended for most applications)"), "\n\n        ", HTML.BR(), HTML.CharRef({             // 147
      html: "&emsp;",                                                                                                  // 148
      str: " "                                                                                                         // 149
    }), HTML.INPUT({                                                                                                   // 150
      id: "configure-login-service-dialog-redirectBasedLogin",                                                         // 151
      type: "radio",                                                                                                   // 152
      name: "loginStyle",                                                                                              // 153
      value: "redirect"                                                                                                // 154
    }), "\n        ", HTML.LABEL({                                                                                     // 155
      "for": "configure-login-service-dialog-redirectBasedLogin"                                                       // 156
    }, "Redirect-based login (special cases such as using a UIWebView)"), "\n      "), "\n      ", HTML.DIV({          // 157
      "class": "new-section"                                                                                           // 158
    }, "\n        ", HTML.DIV({                                                                                        // 159
      "class": "login-button configure-login-service-dismiss-button"                                                   // 160
    }, "\n          I'll do this later\n        "), "\n        ", HTML.A({                                             // 161
      "class": "accounts-close configure-login-service-dismiss-button"                                                 // 162
    }, HTML.CharRef({                                                                                                  // 163
      html: "&times;",                                                                                                 // 164
      str: "×"                                                                                                         // 165
    })), "\n\n        ", HTML.DIV({                                                                                    // 166
      "class": function() {                                                                                            // 167
        return [ "login-button login-button-configure ", Blaze.If(function() {                                         // 168
          return Spacebars.call(view.lookup("saveDisabled"));                                                          // 169
        }, function() {                                                                                                // 170
          return "login-button-disabled";                                                                              // 171
        }) ];                                                                                                          // 172
      },                                                                                                               // 173
      id: "configure-login-service-dialog-save-configuration"                                                          // 174
    }, "\n          Save Configuration\n        "), "\n      "), "\n    "), "\n  " ];                                  // 175
  });                                                                                                                  // 176
}));                                                                                                                   // 177
                                                                                                                       // 178
Template.__checkName("_loginButtonsMessagesDialog");                                                                   // 179
Template["_loginButtonsMessagesDialog"] = new Template("Template._loginButtonsMessagesDialog", (function() {           // 180
  var view = this;                                                                                                     // 181
  return Blaze.If(function() {                                                                                         // 182
    return Spacebars.call(view.lookup("visible"));                                                                     // 183
  }, function() {                                                                                                      // 184
    return [ "\n    ", HTML.DIV({                                                                                      // 185
      "class": "accounts-dialog accounts-centered-dialog",                                                             // 186
      id: "login-buttons-message-dialog"                                                                               // 187
    }, "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n      ", HTML.DIV({             // 188
      "class": "login-button",                                                                                         // 189
      id: "messages-dialog-dismiss-button"                                                                             // 190
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 191
  });                                                                                                                  // 192
}));                                                                                                                   // 193
                                                                                                                       // 194
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_session.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var VALID_KEYS = [                                                                                                     // 1
  'dropdownVisible',                                                                                                   // 2
                                                                                                                       // 3
  // XXX consider replacing these with one key that has an enum for values.                                            // 4
  'inSignupFlow',                                                                                                      // 5
  'inForgotPasswordFlow',                                                                                              // 6
  'inChangePasswordFlow',                                                                                              // 7
  'inMessageOnlyFlow',                                                                                                 // 8
                                                                                                                       // 9
  'errorMessage',                                                                                                      // 10
  'infoMessage',                                                                                                       // 11
                                                                                                                       // 12
  // dialogs with messages (info and error)                                                                            // 13
  'resetPasswordToken',                                                                                                // 14
  'enrollAccountToken',                                                                                                // 15
  'justVerifiedEmail',                                                                                                 // 16
  'justResetPassword',                                                                                                 // 17
                                                                                                                       // 18
  'configureLoginServiceDialogVisible',                                                                                // 19
  'configureLoginServiceDialogServiceName',                                                                            // 20
  'configureLoginServiceDialogSaveDisabled'                                                                            // 21
];                                                                                                                     // 22
                                                                                                                       // 23
var validateKey = function (key) {                                                                                     // 24
  if (!_.contains(VALID_KEYS, key))                                                                                    // 25
    throw new Error("Invalid key in loginButtonsSession: " + key);                                                     // 26
};                                                                                                                     // 27
                                                                                                                       // 28
var KEY_PREFIX = "Meteor.loginButtons.";                                                                               // 29
                                                                                                                       // 30
// XXX This should probably be package scope rather than exported                                                      // 31
// (there was even a comment to that effect here from before we had                                                    // 32
// namespacing) but accounts-ui-viewer uses it, so leave it as is for                                                  // 33
// now                                                                                                                 // 34
Accounts._loginButtonsSession = {                                                                                      // 35
  set: function(key, value) {                                                                                          // 36
    validateKey(key);                                                                                                  // 37
    if (_.contains(['errorMessage', 'infoMessage'], key))                                                              // 38
      throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");
                                                                                                                       // 40
    this._set(key, value);                                                                                             // 41
  },                                                                                                                   // 42
                                                                                                                       // 43
  _set: function(key, value) {                                                                                         // 44
    Session.set(KEY_PREFIX + key, value);                                                                              // 45
  },                                                                                                                   // 46
                                                                                                                       // 47
  get: function(key) {                                                                                                 // 48
    validateKey(key);                                                                                                  // 49
    return Session.get(KEY_PREFIX + key);                                                                              // 50
  },                                                                                                                   // 51
                                                                                                                       // 52
  closeDropdown: function () {                                                                                         // 53
    this.set('inSignupFlow', false);                                                                                   // 54
    this.set('inForgotPasswordFlow', false);                                                                           // 55
    this.set('inChangePasswordFlow', false);                                                                           // 56
    this.set('inMessageOnlyFlow', false);                                                                              // 57
    this.set('dropdownVisible', false);                                                                                // 58
    this.resetMessages();                                                                                              // 59
  },                                                                                                                   // 60
                                                                                                                       // 61
  infoMessage: function(message) {                                                                                     // 62
    this._set("errorMessage", null);                                                                                   // 63
    this._set("infoMessage", message);                                                                                 // 64
    this.ensureMessageVisible();                                                                                       // 65
  },                                                                                                                   // 66
                                                                                                                       // 67
  errorMessage: function(message) {                                                                                    // 68
    this._set("errorMessage", message);                                                                                // 69
    this._set("infoMessage", null);                                                                                    // 70
    this.ensureMessageVisible();                                                                                       // 71
  },                                                                                                                   // 72
                                                                                                                       // 73
  // is there a visible dialog that shows messages (info and error)                                                    // 74
  isMessageDialogVisible: function () {                                                                                // 75
    return this.get('resetPasswordToken') ||                                                                           // 76
      this.get('enrollAccountToken') ||                                                                                // 77
      this.get('justVerifiedEmail');                                                                                   // 78
  },                                                                                                                   // 79
                                                                                                                       // 80
  // ensure that somethings displaying a message (info or error) is                                                    // 81
  // visible.  if a dialog with messages is open, do nothing;                                                          // 82
  // otherwise open the dropdown.                                                                                      // 83
  //                                                                                                                   // 84
  // notably this doesn't matter when only displaying a single login                                                   // 85
  // button since then we have an explicit message dialog                                                              // 86
  // (_loginButtonsMessageDialog), and dropdownVisible is ignored in                                                   // 87
  // this case.                                                                                                        // 88
  ensureMessageVisible: function () {                                                                                  // 89
    if (!this.isMessageDialogVisible())                                                                                // 90
      this.set("dropdownVisible", true);                                                                               // 91
  },                                                                                                                   // 92
                                                                                                                       // 93
  resetMessages: function () {                                                                                         // 94
    this._set("errorMessage", null);                                                                                   // 95
    this._set("infoMessage", null);                                                                                    // 96
  },                                                                                                                   // 97
                                                                                                                       // 98
  configureService: function (name) {                                                                                  // 99
    this.set('configureLoginServiceDialogVisible', true);                                                              // 100
    this.set('configureLoginServiceDialogServiceName', name);                                                          // 101
    this.set('configureLoginServiceDialogSaveDisabled', true);                                                         // 102
  }                                                                                                                    // 103
};                                                                                                                     // 104
                                                                                                                       // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
// shared between dropdown and single mode                                                                             // 4
Template.loginButtons.events({                                                                                         // 5
  'click #login-buttons-logout': function() {                                                                          // 6
    Meteor.logout(function () {                                                                                        // 7
      loginButtonsSession.closeDropdown();                                                                             // 8
    });                                                                                                                // 9
  }                                                                                                                    // 10
});                                                                                                                    // 11
                                                                                                                       // 12
UI.registerHelper('loginButtons', function () {                                                                        // 13
  throw new Error("Use {{> loginButtons}} instead of {{loginButtons}}");                                               // 14
});                                                                                                                    // 15
                                                                                                                       // 16
//                                                                                                                     // 17
// helpers                                                                                                             // 18
//                                                                                                                     // 19
                                                                                                                       // 20
displayName = function () {                                                                                            // 21
  var user = Meteor.user();                                                                                            // 22
  if (!user)                                                                                                           // 23
    return '';                                                                                                         // 24
                                                                                                                       // 25
  if (user.profile && user.profile.name)                                                                               // 26
    return user.profile.name;                                                                                          // 27
  if (user.username)                                                                                                   // 28
    return user.username;                                                                                              // 29
  if (user.emails && user.emails[0] && user.emails[0].address)                                                         // 30
    return user.emails[0].address;                                                                                     // 31
                                                                                                                       // 32
  return '';                                                                                                           // 33
};                                                                                                                     // 34
                                                                                                                       // 35
// returns an array of the login services used by this app. each                                                       // 36
// element of the array is an object (eg {name: 'facebook'}), since                                                    // 37
// that makes it useful in combination with handlebars {{#each}}.                                                      // 38
//                                                                                                                     // 39
// don't cache the output of this function: if called during startup (before                                           // 40
// oauth packages load) it might not include them all.                                                                 // 41
//                                                                                                                     // 42
// NOTE: It is very important to have this return password last                                                        // 43
// because of the way we render the different providers in                                                             // 44
// login_buttons_dropdown.html                                                                                         // 45
getLoginServices = function () {                                                                                       // 46
  var self = this;                                                                                                     // 47
                                                                                                                       // 48
  // First look for OAuth services.                                                                                    // 49
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];                                       // 50
                                                                                                                       // 51
  // Be equally kind to all login services. This also preserves                                                        // 52
  // backwards-compatibility. (But maybe order should be                                                               // 53
  // configurable?)                                                                                                    // 54
  services.sort();                                                                                                     // 55
                                                                                                                       // 56
  // Add password, if it's there; it must come last.                                                                   // 57
  if (hasPasswordService())                                                                                            // 58
    services.push('password');                                                                                         // 59
                                                                                                                       // 60
  return _.map(services, function(name) {                                                                              // 61
    return {name: name};                                                                                               // 62
  });                                                                                                                  // 63
};                                                                                                                     // 64
                                                                                                                       // 65
hasPasswordService = function () {                                                                                     // 66
  return !!Package['accounts-password'];                                                                               // 67
};                                                                                                                     // 68
                                                                                                                       // 69
dropdown = function () {                                                                                               // 70
  return hasPasswordService() || getLoginServices().length > 1;                                                        // 71
};                                                                                                                     // 72
                                                                                                                       // 73
// XXX improve these. should this be in accounts-password instead?                                                     // 74
//                                                                                                                     // 75
// XXX these will become configurable, and will be validated on                                                        // 76
// the server as well.                                                                                                 // 77
validateUsername = function (username) {                                                                               // 78
  if (username.length >= 3) {                                                                                          // 79
    return true;                                                                                                       // 80
  } else {                                                                                                             // 81
    loginButtonsSession.errorMessage("Username must be at least 3 characters long");                                   // 82
    return false;                                                                                                      // 83
  }                                                                                                                    // 84
};                                                                                                                     // 85
validateEmail = function (email) {                                                                                     // 86
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')                                        // 87
    return true;                                                                                                       // 88
                                                                                                                       // 89
  if (email.indexOf('@') !== -1) {                                                                                     // 90
    return true;                                                                                                       // 91
  } else {                                                                                                             // 92
    loginButtonsSession.errorMessage("Invalid email");                                                                 // 93
    return false;                                                                                                      // 94
  }                                                                                                                    // 95
};                                                                                                                     // 96
validatePassword = function (password) {                                                                               // 97
  if (password.length >= 6) {                                                                                          // 98
    return true;                                                                                                       // 99
  } else {                                                                                                             // 100
    loginButtonsSession.errorMessage("Password must be at least 6 characters long");                                   // 101
    return false;                                                                                                      // 102
  }                                                                                                                    // 103
};                                                                                                                     // 104
                                                                                                                       // 105
//                                                                                                                     // 106
// loginButtonLoggedOut template                                                                                       // 107
//                                                                                                                     // 108
                                                                                                                       // 109
Template._loginButtonsLoggedOut.dropdown = dropdown;                                                                   // 110
                                                                                                                       // 111
Template._loginButtonsLoggedOut.services = getLoginServices;                                                           // 112
                                                                                                                       // 113
Template._loginButtonsLoggedOut.singleService = function () {                                                          // 114
  var services = getLoginServices();                                                                                   // 115
  if (services.length !== 1)                                                                                           // 116
    throw new Error(                                                                                                   // 117
      "Shouldn't be rendering this template with more than one configured service");                                   // 118
  return services[0];                                                                                                  // 119
};                                                                                                                     // 120
                                                                                                                       // 121
Template._loginButtonsLoggedOut.configurationLoaded = function () {                                                    // 122
  return Accounts.loginServicesConfigured();                                                                           // 123
};                                                                                                                     // 124
                                                                                                                       // 125
                                                                                                                       // 126
//                                                                                                                     // 127
// loginButtonsLoggedIn template                                                                                       // 128
//                                                                                                                     // 129
                                                                                                                       // 130
// decide whether we should show a dropdown rather than a row of                                                       // 131
// buttons                                                                                                             // 132
Template._loginButtonsLoggedIn.dropdown = dropdown;                                                                    // 133
                                                                                                                       // 134
                                                                                                                       // 135
                                                                                                                       // 136
//                                                                                                                     // 137
// loginButtonsLoggedInSingleLogoutButton template                                                                     // 138
//                                                                                                                     // 139
                                                                                                                       // 140
Template._loginButtonsLoggedInSingleLogoutButton.displayName = displayName;                                            // 141
                                                                                                                       // 142
                                                                                                                       // 143
                                                                                                                       // 144
//                                                                                                                     // 145
// loginButtonsMessage template                                                                                        // 146
//                                                                                                                     // 147
                                                                                                                       // 148
Template._loginButtonsMessages.errorMessage = function () {                                                            // 149
  return loginButtonsSession.get('errorMessage');                                                                      // 150
};                                                                                                                     // 151
                                                                                                                       // 152
Template._loginButtonsMessages.infoMessage = function () {                                                             // 153
  return loginButtonsSession.get('infoMessage');                                                                       // 154
};                                                                                                                     // 155
                                                                                                                       // 156
                                                                                                                       // 157
//                                                                                                                     // 158
// loginButtonsLoggingInPadding template                                                                               // 159
//                                                                                                                     // 160
                                                                                                                       // 161
Template._loginButtonsLoggingInPadding.dropdown = dropdown;                                                            // 162
                                                                                                                       // 163
                                                                                                                       // 164
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_single.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
                                                                                                                       // 4
var loginResultCallback = function (serviceName, err) {                                                                // 5
  if (!err) {                                                                                                          // 6
    loginButtonsSession.closeDropdown();                                                                               // 7
  } else if (err instanceof Accounts.LoginCancelledError) {                                                            // 8
    // do nothing                                                                                                      // 9
  } else if (err instanceof ServiceConfiguration.ConfigError) {                                                        // 10
    loginButtonsSession.configureService(serviceName);                                                                 // 11
  } else {                                                                                                             // 12
    loginButtonsSession.errorMessage(err.reason || "Unknown error");                                                   // 13
  }                                                                                                                    // 14
};                                                                                                                     // 15
                                                                                                                       // 16
                                                                                                                       // 17
// In the login redirect flow, we'll have the result of the login                                                      // 18
// attempt at page load time when we're redirected back to the                                                         // 19
// application.  Register a callback to update the UI (i.e. to close                                                   // 20
// the dialog on a successful login or display the error on a failed                                                   // 21
// login).                                                                                                             // 22
//                                                                                                                     // 23
Accounts.onPageLoadLogin(function (attemptInfo) {                                                                      // 24
  // Ignore if we have a left over login attempt for a service that is no longer registered.                           // 25
  if (_.contains(_.pluck(getLoginServices(), "name"), attemptInfo.type))                                               // 26
    loginResultCallback(attemptInfo.type, attemptInfo.error);                                                          // 27
});                                                                                                                    // 28
                                                                                                                       // 29
                                                                                                                       // 30
Template._loginButtonsLoggedOutSingleLoginButton.events({                                                              // 31
  'click .login-button': function () {                                                                                 // 32
    var serviceName = this.name;                                                                                       // 33
    loginButtonsSession.resetMessages();                                                                               // 34
                                                                                                                       // 35
    // XXX Service providers should be able to specify their                                                           // 36
    // `Meteor.loginWithX` method name.                                                                                // 37
    var loginWithService = Meteor["loginWith" +                                                                        // 38
                                  (serviceName === 'meteor-developer' ?                                                // 39
                                   'MeteorDeveloperAccount' :                                                          // 40
                                   capitalize(serviceName))];                                                          // 41
                                                                                                                       // 42
    var options = {}; // use default scope unless specified                                                            // 43
    if (Accounts.ui._options.requestPermissions[serviceName])                                                          // 44
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];                               // 45
    if (Accounts.ui._options.requestOfflineToken[serviceName])                                                         // 46
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];                             // 47
    if (Accounts.ui._options.forceApprovalPrompt[serviceName])                                                         // 48
      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];                             // 49
                                                                                                                       // 50
    loginWithService(options, function (err) {                                                                         // 51
      loginResultCallback(serviceName, err);                                                                           // 52
    });                                                                                                                // 53
  }                                                                                                                    // 54
});                                                                                                                    // 55
                                                                                                                       // 56
Template._loginButtonsLoggedOutSingleLoginButton.configured = function () {                                            // 57
  return !!ServiceConfiguration.configurations.findOne({service: this.name});                                          // 58
};                                                                                                                     // 59
                                                                                                                       // 60
Template._loginButtonsLoggedOutSingleLoginButton.capitalizedName = function () {                                       // 61
  if (this.name === 'github')                                                                                          // 62
    // XXX we should allow service packages to set their capitalized name                                              // 63
    return 'GitHub';                                                                                                   // 64
  else if (this.name === 'meteor-developer')                                                                           // 65
    return 'Meteor';                                                                                                   // 66
  else                                                                                                                 // 67
    return capitalize(this.name);                                                                                      // 68
};                                                                                                                     // 69
                                                                                                                       // 70
// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                         // 71
var capitalize = function(str){                                                                                        // 72
  str = str == null ? '' : String(str);                                                                                // 73
  return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 74
};                                                                                                                     // 75
                                                                                                                       // 76
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_dropdown.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
// events shared between loginButtonsLoggedOutDropdown and                                                             // 4
// loginButtonsLoggedInDropdown                                                                                        // 5
Template.loginButtons.events({                                                                                         // 6
  'click #login-name-link, click #login-sign-in-link': function () {                                                   // 7
    loginButtonsSession.set('dropdownVisible', true);                                                                  // 8
    Tracker.flush();                                                                                                   // 9
    correctDropdownZIndexes();                                                                                         // 10
  },                                                                                                                   // 11
  'click .login-close-text': function () {                                                                             // 12
    loginButtonsSession.closeDropdown();                                                                               // 13
  }                                                                                                                    // 14
});                                                                                                                    // 15
                                                                                                                       // 16
                                                                                                                       // 17
//                                                                                                                     // 18
// loginButtonsLoggedInDropdown template and related                                                                   // 19
//                                                                                                                     // 20
                                                                                                                       // 21
Template._loginButtonsLoggedInDropdown.events({                                                                        // 22
  'click #login-buttons-open-change-password': function() {                                                            // 23
    loginButtonsSession.resetMessages();                                                                               // 24
    loginButtonsSession.set('inChangePasswordFlow', true);                                                             // 25
  }                                                                                                                    // 26
});                                                                                                                    // 27
                                                                                                                       // 28
Template._loginButtonsLoggedInDropdown.displayName = displayName;                                                      // 29
                                                                                                                       // 30
Template._loginButtonsLoggedInDropdown.inChangePasswordFlow = function () {                                            // 31
  return loginButtonsSession.get('inChangePasswordFlow');                                                              // 32
};                                                                                                                     // 33
                                                                                                                       // 34
Template._loginButtonsLoggedInDropdown.inMessageOnlyFlow = function () {                                               // 35
  return loginButtonsSession.get('inMessageOnlyFlow');                                                                 // 36
};                                                                                                                     // 37
                                                                                                                       // 38
Template._loginButtonsLoggedInDropdown.dropdownVisible = function () {                                                 // 39
  return loginButtonsSession.get('dropdownVisible');                                                                   // 40
};                                                                                                                     // 41
                                                                                                                       // 42
Template._loginButtonsLoggedInDropdownActions.allowChangingPassword = function () {                                    // 43
  // it would be more correct to check whether the user has a password set,                                            // 44
  // but in order to do that we'd have to send more data down to the client,                                           // 45
  // and it'd be preferable not to send down the entire service.password document.                                     // 46
  //                                                                                                                   // 47
  // instead we use the heuristic: if the user has a username or email set.                                            // 48
  var user = Meteor.user();                                                                                            // 49
  return user.username || (user.emails && user.emails[0] && user.emails[0].address);                                   // 50
};                                                                                                                     // 51
                                                                                                                       // 52
                                                                                                                       // 53
//                                                                                                                     // 54
// loginButtonsLoggedOutDropdown template and related                                                                  // 55
//                                                                                                                     // 56
                                                                                                                       // 57
Template._loginButtonsLoggedOutDropdown.events({                                                                       // 58
  'click #login-buttons-password': function () {                                                                       // 59
    loginOrSignup();                                                                                                   // 60
  },                                                                                                                   // 61
                                                                                                                       // 62
  'keypress #forgot-password-email': function (event) {                                                                // 63
    if (event.keyCode === 13)                                                                                          // 64
      forgotPassword();                                                                                                // 65
  },                                                                                                                   // 66
                                                                                                                       // 67
  'click #login-buttons-forgot-password': function () {                                                                // 68
    forgotPassword();                                                                                                  // 69
  },                                                                                                                   // 70
                                                                                                                       // 71
  'click #signup-link': function () {                                                                                  // 72
    loginButtonsSession.resetMessages();                                                                               // 73
                                                                                                                       // 74
    // store values of fields before swtiching to the signup form                                                      // 75
    var username = trimmedElementValueById('login-username');                                                          // 76
    var email = trimmedElementValueById('login-email');                                                                // 77
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                          // 78
    // notably not trimmed. a password could (?) start or end with a space                                             // 79
    var password = elementValueById('login-password');                                                                 // 80
                                                                                                                       // 81
    loginButtonsSession.set('inSignupFlow', true);                                                                     // 82
    loginButtonsSession.set('inForgotPasswordFlow', false);                                                            // 83
    // force the ui to update so that we have the approprate fields to fill in                                         // 84
    Tracker.flush();                                                                                                   // 85
                                                                                                                       // 86
    // update new fields with appropriate defaults                                                                     // 87
    if (username !== null)                                                                                             // 88
      document.getElementById('login-username').value = username;                                                      // 89
    else if (email !== null)                                                                                           // 90
      document.getElementById('login-email').value = email;                                                            // 91
    else if (usernameOrEmail !== null)                                                                                 // 92
      if (usernameOrEmail.indexOf('@') === -1)                                                                         // 93
        document.getElementById('login-username').value = usernameOrEmail;                                             // 94
    else                                                                                                               // 95
      document.getElementById('login-email').value = usernameOrEmail;                                                  // 96
                                                                                                                       // 97
    if (password !== null)                                                                                             // 98
      document.getElementById('login-password').value = password;                                                      // 99
                                                                                                                       // 100
    // Force redrawing the `login-dropdown-list` element because of                                                    // 101
    // a bizarre Chrome bug in which part of the DIV is not redrawn                                                    // 102
    // in case you had tried to unsuccessfully log in before                                                           // 103
    // switching to the signup form.                                                                                   // 104
    //                                                                                                                 // 105
    // Found tip on how to force a redraw on                                                                           // 106
    // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
    var redraw = document.getElementById('login-dropdown-list');                                                       // 108
    redraw.style.display = 'none';                                                                                     // 109
    redraw.offsetHeight; // it seems that this line does nothing but is necessary for the redraw to work               // 110
    redraw.style.display = 'block';                                                                                    // 111
  },                                                                                                                   // 112
  'click #forgot-password-link': function () {                                                                         // 113
    loginButtonsSession.resetMessages();                                                                               // 114
                                                                                                                       // 115
    // store values of fields before swtiching to the signup form                                                      // 116
    var email = trimmedElementValueById('login-email');                                                                // 117
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                          // 118
                                                                                                                       // 119
    loginButtonsSession.set('inSignupFlow', false);                                                                    // 120
    loginButtonsSession.set('inForgotPasswordFlow', true);                                                             // 121
    // force the ui to update so that we have the approprate fields to fill in                                         // 122
    Tracker.flush();                                                                                                   // 123
                                                                                                                       // 124
    // update new fields with appropriate defaults                                                                     // 125
    if (email !== null)                                                                                                // 126
      document.getElementById('forgot-password-email').value = email;                                                  // 127
    else if (usernameOrEmail !== null)                                                                                 // 128
      if (usernameOrEmail.indexOf('@') !== -1)                                                                         // 129
        document.getElementById('forgot-password-email').value = usernameOrEmail;                                      // 130
                                                                                                                       // 131
  },                                                                                                                   // 132
  'click #back-to-login-link': function () {                                                                           // 133
    loginButtonsSession.resetMessages();                                                                               // 134
                                                                                                                       // 135
    var username = trimmedElementValueById('login-username');                                                          // 136
    var email = trimmedElementValueById('login-email')                                                                 // 137
          || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?                          // 138
    // notably not trimmed. a password could (?) start or end with a space                                             // 139
    var password = elementValueById('login-password');                                                                 // 140
                                                                                                                       // 141
    loginButtonsSession.set('inSignupFlow', false);                                                                    // 142
    loginButtonsSession.set('inForgotPasswordFlow', false);                                                            // 143
    // force the ui to update so that we have the approprate fields to fill in                                         // 144
    Tracker.flush();                                                                                                   // 145
                                                                                                                       // 146
    if (document.getElementById('login-username'))                                                                     // 147
      document.getElementById('login-username').value = username;                                                      // 148
    if (document.getElementById('login-email'))                                                                        // 149
      document.getElementById('login-email').value = email;                                                            // 150
                                                                                                                       // 151
    if (document.getElementById('login-username-or-email'))                                                            // 152
      document.getElementById('login-username-or-email').value = email || username;                                    // 153
                                                                                                                       // 154
    if (password !== null)                                                                                             // 155
      document.getElementById('login-password').value = password;                                                      // 156
  },                                                                                                                   // 157
  'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function (event) {
    if (event.keyCode === 13)                                                                                          // 159
      loginOrSignup();                                                                                                 // 160
  }                                                                                                                    // 161
});                                                                                                                    // 162
                                                                                                                       // 163
// additional classes that can be helpful in styling the dropdown                                                      // 164
Template._loginButtonsLoggedOutDropdown.additionalClasses = function () {                                              // 165
  if (!hasPasswordService()) {                                                                                         // 166
    return false;                                                                                                      // 167
  } else {                                                                                                             // 168
    if (loginButtonsSession.get('inSignupFlow')) {                                                                     // 169
      return 'login-form-create-account';                                                                              // 170
    } else if (loginButtonsSession.get('inForgotPasswordFlow')) {                                                      // 171
      return 'login-form-forgot-password';                                                                             // 172
    } else {                                                                                                           // 173
      return 'login-form-sign-in';                                                                                     // 174
    }                                                                                                                  // 175
  }                                                                                                                    // 176
};                                                                                                                     // 177
                                                                                                                       // 178
Template._loginButtonsLoggedOutDropdown.dropdownVisible = function () {                                                // 179
  return loginButtonsSession.get('dropdownVisible');                                                                   // 180
};                                                                                                                     // 181
                                                                                                                       // 182
Template._loginButtonsLoggedOutDropdown.hasPasswordService = hasPasswordService;                                       // 183
                                                                                                                       // 184
// return all login services, with password last                                                                       // 185
Template._loginButtonsLoggedOutAllServices.services = getLoginServices;                                                // 186
                                                                                                                       // 187
Template._loginButtonsLoggedOutAllServices.isPasswordService = function () {                                           // 188
  return this.name === 'password';                                                                                     // 189
};                                                                                                                     // 190
                                                                                                                       // 191
Template._loginButtonsLoggedOutAllServices.hasOtherServices = function () {                                            // 192
  return getLoginServices().length > 1;                                                                                // 193
};                                                                                                                     // 194
                                                                                                                       // 195
Template._loginButtonsLoggedOutAllServices.hasPasswordService =                                                        // 196
  hasPasswordService;                                                                                                  // 197
                                                                                                                       // 198
Template._loginButtonsLoggedOutPasswordService.fields = function () {                                                  // 199
  var loginFields = [                                                                                                  // 200
    {fieldName: 'username-or-email', fieldLabel: 'Username or Email',                                                  // 201
     visible: function () {                                                                                            // 202
       return _.contains(                                                                                              // 203
         ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],                                                        // 204
         passwordSignupFields());                                                                                      // 205
     }},                                                                                                               // 206
    {fieldName: 'username', fieldLabel: 'Username',                                                                    // 207
     visible: function () {                                                                                            // 208
       return passwordSignupFields() === "USERNAME_ONLY";                                                              // 209
     }},                                                                                                               // 210
    {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',                                                      // 211
     visible: function () {                                                                                            // 212
       return passwordSignupFields() === "EMAIL_ONLY";                                                                 // 213
     }},                                                                                                               // 214
    {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',                                             // 215
     visible: function () {                                                                                            // 216
       return true;                                                                                                    // 217
     }}                                                                                                                // 218
  ];                                                                                                                   // 219
                                                                                                                       // 220
  var signupFields = [                                                                                                 // 221
    {fieldName: 'username', fieldLabel: 'Username',                                                                    // 222
     visible: function () {                                                                                            // 223
       return _.contains(                                                                                              // 224
         ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                       // 225
         passwordSignupFields());                                                                                      // 226
     }},                                                                                                               // 227
    {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',                                                      // 228
     visible: function () {                                                                                            // 229
       return _.contains(                                                                                              // 230
         ["USERNAME_AND_EMAIL", "EMAIL_ONLY"],                                                                         // 231
         passwordSignupFields());                                                                                      // 232
     }},                                                                                                               // 233
    {fieldName: 'email', fieldLabel: 'Email (optional)', inputType: 'email',                                           // 234
     visible: function () {                                                                                            // 235
       return passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";                                                // 236
     }},                                                                                                               // 237
    {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',                                             // 238
     visible: function () {                                                                                            // 239
       return true;                                                                                                    // 240
     }},                                                                                                               // 241
    {fieldName: 'password-again', fieldLabel: 'Password (again)',                                                      // 242
     inputType: 'password',                                                                                            // 243
     visible: function () {                                                                                            // 244
       // No need to make users double-enter their password if                                                         // 245
       // they'll necessarily have an email set, since they can use                                                    // 246
       // the "forgot password" flow.                                                                                  // 247
       return _.contains(                                                                                              // 248
         ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                             // 249
         passwordSignupFields());                                                                                      // 250
     }}                                                                                                                // 251
  ];                                                                                                                   // 252
                                                                                                                       // 253
  return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;                                         // 254
};                                                                                                                     // 255
                                                                                                                       // 256
Template._loginButtonsLoggedOutPasswordService.inForgotPasswordFlow = function () {                                    // 257
  return loginButtonsSession.get('inForgotPasswordFlow');                                                              // 258
};                                                                                                                     // 259
                                                                                                                       // 260
Template._loginButtonsLoggedOutPasswordService.inLoginFlow = function () {                                             // 261
  return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');                 // 262
};                                                                                                                     // 263
                                                                                                                       // 264
Template._loginButtonsLoggedOutPasswordService.inSignupFlow = function () {                                            // 265
  return loginButtonsSession.get('inSignupFlow');                                                                      // 266
};                                                                                                                     // 267
                                                                                                                       // 268
Template._loginButtonsLoggedOutPasswordService.showCreateAccountLink = function () {                                   // 269
  return !Accounts._options.forbidClientAccountCreation;                                                               // 270
};                                                                                                                     // 271
                                                                                                                       // 272
Template._loginButtonsLoggedOutPasswordService.showForgotPasswordLink = function () {                                  // 273
  return _.contains(                                                                                                   // 274
    ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],                                               // 275
    passwordSignupFields());                                                                                           // 276
};                                                                                                                     // 277
                                                                                                                       // 278
Template._loginButtonsFormField.inputType = function () {                                                              // 279
  return this.inputType || "text";                                                                                     // 280
};                                                                                                                     // 281
                                                                                                                       // 282
                                                                                                                       // 283
//                                                                                                                     // 284
// loginButtonsChangePassword template                                                                                 // 285
//                                                                                                                     // 286
                                                                                                                       // 287
Template._loginButtonsChangePassword.events({                                                                          // 288
  'keypress #login-old-password, keypress #login-password, keypress #login-password-again': function (event) {         // 289
    if (event.keyCode === 13)                                                                                          // 290
      changePassword();                                                                                                // 291
  },                                                                                                                   // 292
  'click #login-buttons-do-change-password': function () {                                                             // 293
    changePassword();                                                                                                  // 294
  }                                                                                                                    // 295
});                                                                                                                    // 296
                                                                                                                       // 297
Template._loginButtonsChangePassword.fields = function () {                                                            // 298
  return [                                                                                                             // 299
    {fieldName: 'old-password', fieldLabel: 'Current Password', inputType: 'password',                                 // 300
     visible: function () {                                                                                            // 301
       return true;                                                                                                    // 302
     }},                                                                                                               // 303
    {fieldName: 'password', fieldLabel: 'New Password', inputType: 'password',                                         // 304
     visible: function () {                                                                                            // 305
       return true;                                                                                                    // 306
     }},                                                                                                               // 307
    {fieldName: 'password-again', fieldLabel: 'New Password (again)',                                                  // 308
     inputType: 'password',                                                                                            // 309
     visible: function () {                                                                                            // 310
       // No need to make users double-enter their password if                                                         // 311
       // they'll necessarily have an email set, since they can use                                                    // 312
       // the "forgot password" flow.                                                                                  // 313
       return _.contains(                                                                                              // 314
         ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                             // 315
         passwordSignupFields());                                                                                      // 316
     }}                                                                                                                // 317
  ];                                                                                                                   // 318
};                                                                                                                     // 319
                                                                                                                       // 320
                                                                                                                       // 321
//                                                                                                                     // 322
// helpers                                                                                                             // 323
//                                                                                                                     // 324
                                                                                                                       // 325
var elementValueById = function(id) {                                                                                  // 326
  var element = document.getElementById(id);                                                                           // 327
  if (!element)                                                                                                        // 328
    return null;                                                                                                       // 329
  else                                                                                                                 // 330
    return element.value;                                                                                              // 331
};                                                                                                                     // 332
                                                                                                                       // 333
var trimmedElementValueById = function(id) {                                                                           // 334
  var element = document.getElementById(id);                                                                           // 335
  if (!element)                                                                                                        // 336
    return null;                                                                                                       // 337
  else                                                                                                                 // 338
    return element.value.replace(/^\s*|\s*$/g, ""); // trim() doesn't work on IE8;                                     // 339
};                                                                                                                     // 340
                                                                                                                       // 341
var loginOrSignup = function () {                                                                                      // 342
  if (loginButtonsSession.get('inSignupFlow'))                                                                         // 343
    signup();                                                                                                          // 344
  else                                                                                                                 // 345
    login();                                                                                                           // 346
};                                                                                                                     // 347
                                                                                                                       // 348
var login = function () {                                                                                              // 349
  loginButtonsSession.resetMessages();                                                                                 // 350
                                                                                                                       // 351
  var username = trimmedElementValueById('login-username');                                                            // 352
  var email = trimmedElementValueById('login-email');                                                                  // 353
  var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                            // 354
  // notably not trimmed. a password could (?) start or end with a space                                               // 355
  var password = elementValueById('login-password');                                                                   // 356
                                                                                                                       // 357
  var loginSelector;                                                                                                   // 358
  if (username !== null) {                                                                                             // 359
    if (!validateUsername(username))                                                                                   // 360
      return;                                                                                                          // 361
    else                                                                                                               // 362
      loginSelector = {username: username};                                                                            // 363
  } else if (email !== null) {                                                                                         // 364
    if (!validateEmail(email))                                                                                         // 365
      return;                                                                                                          // 366
    else                                                                                                               // 367
      loginSelector = {email: email};                                                                                  // 368
  } else if (usernameOrEmail !== null) {                                                                               // 369
    // XXX not sure how we should validate this. but this seems good enough (for now),                                 // 370
    // since an email must have at least 3 characters anyways                                                          // 371
    if (!validateUsername(usernameOrEmail))                                                                            // 372
      return;                                                                                                          // 373
    else                                                                                                               // 374
      loginSelector = usernameOrEmail;                                                                                 // 375
  } else {                                                                                                             // 376
    throw new Error("Unexpected -- no element to use as a login user selector");                                       // 377
  }                                                                                                                    // 378
                                                                                                                       // 379
  Meteor.loginWithPassword(loginSelector, password, function (error, result) {                                         // 380
    if (error) {                                                                                                       // 381
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 382
    } else {                                                                                                           // 383
      loginButtonsSession.closeDropdown();                                                                             // 384
    }                                                                                                                  // 385
  });                                                                                                                  // 386
};                                                                                                                     // 387
                                                                                                                       // 388
var signup = function () {                                                                                             // 389
  loginButtonsSession.resetMessages();                                                                                 // 390
                                                                                                                       // 391
  var options = {}; // to be passed to Accounts.createUser                                                             // 392
                                                                                                                       // 393
  var username = trimmedElementValueById('login-username');                                                            // 394
  if (username !== null) {                                                                                             // 395
    if (!validateUsername(username))                                                                                   // 396
      return;                                                                                                          // 397
    else                                                                                                               // 398
      options.username = username;                                                                                     // 399
  }                                                                                                                    // 400
                                                                                                                       // 401
  var email = trimmedElementValueById('login-email');                                                                  // 402
  if (email !== null) {                                                                                                // 403
    if (!validateEmail(email))                                                                                         // 404
      return;                                                                                                          // 405
    else                                                                                                               // 406
      options.email = email;                                                                                           // 407
  }                                                                                                                    // 408
                                                                                                                       // 409
  // notably not trimmed. a password could (?) start or end with a space                                               // 410
  var password = elementValueById('login-password');                                                                   // 411
  if (!validatePassword(password))                                                                                     // 412
    return;                                                                                                            // 413
  else                                                                                                                 // 414
    options.password = password;                                                                                       // 415
                                                                                                                       // 416
  if (!matchPasswordAgainIfPresent())                                                                                  // 417
    return;                                                                                                            // 418
                                                                                                                       // 419
  Accounts.createUser(options, function (error) {                                                                      // 420
    if (error) {                                                                                                       // 421
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 422
    } else {                                                                                                           // 423
      loginButtonsSession.closeDropdown();                                                                             // 424
    }                                                                                                                  // 425
  });                                                                                                                  // 426
};                                                                                                                     // 427
                                                                                                                       // 428
var forgotPassword = function () {                                                                                     // 429
  loginButtonsSession.resetMessages();                                                                                 // 430
                                                                                                                       // 431
  var email = trimmedElementValueById("forgot-password-email");                                                        // 432
  if (email.indexOf('@') !== -1) {                                                                                     // 433
    Accounts.forgotPassword({email: email}, function (error) {                                                         // 434
      if (error)                                                                                                       // 435
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 436
      else                                                                                                             // 437
        loginButtonsSession.infoMessage("Email sent");                                                                 // 438
    });                                                                                                                // 439
  } else {                                                                                                             // 440
    loginButtonsSession.errorMessage("Invalid email");                                                                 // 441
  }                                                                                                                    // 442
};                                                                                                                     // 443
                                                                                                                       // 444
var changePassword = function () {                                                                                     // 445
  loginButtonsSession.resetMessages();                                                                                 // 446
                                                                                                                       // 447
  // notably not trimmed. a password could (?) start or end with a space                                               // 448
  var oldPassword = elementValueById('login-old-password');                                                            // 449
                                                                                                                       // 450
  // notably not trimmed. a password could (?) start or end with a space                                               // 451
  var password = elementValueById('login-password');                                                                   // 452
  if (!validatePassword(password))                                                                                     // 453
    return;                                                                                                            // 454
                                                                                                                       // 455
  if (!matchPasswordAgainIfPresent())                                                                                  // 456
    return;                                                                                                            // 457
                                                                                                                       // 458
  Accounts.changePassword(oldPassword, password, function (error) {                                                    // 459
    if (error) {                                                                                                       // 460
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 461
    } else {                                                                                                           // 462
      loginButtonsSession.set('inChangePasswordFlow', false);                                                          // 463
      loginButtonsSession.set('inMessageOnlyFlow', true);                                                              // 464
      loginButtonsSession.infoMessage("Password changed");                                                             // 465
    }                                                                                                                  // 466
  });                                                                                                                  // 467
};                                                                                                                     // 468
                                                                                                                       // 469
var matchPasswordAgainIfPresent = function () {                                                                        // 470
  // notably not trimmed. a password could (?) start or end with a space                                               // 471
  var passwordAgain = elementValueById('login-password-again');                                                        // 472
  if (passwordAgain !== null) {                                                                                        // 473
    // notably not trimmed. a password could (?) start or end with a space                                             // 474
    var password = elementValueById('login-password');                                                                 // 475
    if (password !== passwordAgain) {                                                                                  // 476
      loginButtonsSession.errorMessage("Passwords don't match");                                                       // 477
      return false;                                                                                                    // 478
    }                                                                                                                  // 479
  }                                                                                                                    // 480
  return true;                                                                                                         // 481
};                                                                                                                     // 482
                                                                                                                       // 483
var correctDropdownZIndexes = function () {                                                                            // 484
  // IE <= 7 has a z-index bug that means we can't just give the                                                       // 485
  // dropdown a z-index and expect it to stack above the rest of                                                       // 486
  // the page even if nothing else has a z-index.  The nature of                                                       // 487
  // the bug is that all positioned elements are considered to                                                         // 488
  // have z-index:0 (not auto) and therefore start new stacking                                                        // 489
  // contexts, with ties broken by page order.                                                                         // 490
  //                                                                                                                   // 491
  // The fix, then is to give z-index:1 to all ancestors                                                               // 492
  // of the dropdown having z-index:0.                                                                                 // 493
  for(var n = document.getElementById('login-dropdown-list').parentNode;                                               // 494
      n.nodeName !== 'BODY';                                                                                           // 495
      n = n.parentNode)                                                                                                // 496
    if (n.style.zIndex === 0)                                                                                          // 497
      n.style.zIndex = 1;                                                                                              // 498
};                                                                                                                     // 499
                                                                                                                       // 500
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_dialogs.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
                                                                                                                       // 4
//                                                                                                                     // 5
// populate the session so that the appropriate dialogs are                                                            // 6
// displayed by reading variables set by accounts-base, which parses                                                   // 7
// special URLs. since accounts-ui depends on accounts-base, we are                                                    // 8
// guaranteed to have these set at this point.                                                                         // 9
//                                                                                                                     // 10
                                                                                                                       // 11
if (Accounts._resetPasswordToken) {                                                                                    // 12
  loginButtonsSession.set('resetPasswordToken', Accounts._resetPasswordToken);                                         // 13
}                                                                                                                      // 14
                                                                                                                       // 15
if (Accounts._enrollAccountToken) {                                                                                    // 16
  loginButtonsSession.set('enrollAccountToken', Accounts._enrollAccountToken);                                         // 17
}                                                                                                                      // 18
                                                                                                                       // 19
// Needs to be in Meteor.startup because of a package loading order                                                    // 20
// issue. We can't be sure that accounts-password is loaded earlier                                                    // 21
// than accounts-ui so Accounts.verifyEmail might not be defined.                                                      // 22
Meteor.startup(function () {                                                                                           // 23
  if (Accounts._verifyEmailToken) {                                                                                    // 24
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {                                                 // 25
      Accounts._enableAutoLogin();                                                                                     // 26
      if (!error)                                                                                                      // 27
        loginButtonsSession.set('justVerifiedEmail', true);                                                            // 28
      // XXX show something if there was an error.                                                                     // 29
    });                                                                                                                // 30
  }                                                                                                                    // 31
});                                                                                                                    // 32
                                                                                                                       // 33
                                                                                                                       // 34
//                                                                                                                     // 35
// resetPasswordDialog template                                                                                        // 36
//                                                                                                                     // 37
                                                                                                                       // 38
Template._resetPasswordDialog.events({                                                                                 // 39
  'click #login-buttons-reset-password-button': function () {                                                          // 40
    resetPassword();                                                                                                   // 41
  },                                                                                                                   // 42
  'keypress #reset-password-new-password': function (event) {                                                          // 43
    if (event.keyCode === 13)                                                                                          // 44
      resetPassword();                                                                                                 // 45
  },                                                                                                                   // 46
  'click #login-buttons-cancel-reset-password': function () {                                                          // 47
    loginButtonsSession.set('resetPasswordToken', null);                                                               // 48
    Accounts._enableAutoLogin();                                                                                       // 49
  }                                                                                                                    // 50
});                                                                                                                    // 51
                                                                                                                       // 52
var resetPassword = function () {                                                                                      // 53
  loginButtonsSession.resetMessages();                                                                                 // 54
  var newPassword = document.getElementById('reset-password-new-password').value;                                      // 55
  if (!validatePassword(newPassword))                                                                                  // 56
    return;                                                                                                            // 57
                                                                                                                       // 58
  Accounts.resetPassword(                                                                                              // 59
    loginButtonsSession.get('resetPasswordToken'), newPassword,                                                        // 60
    function (error) {                                                                                                 // 61
      if (error) {                                                                                                     // 62
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 63
      } else {                                                                                                         // 64
        loginButtonsSession.set('resetPasswordToken', null);                                                           // 65
        loginButtonsSession.set('justResetPassword', true);                                                            // 66
        Accounts._enableAutoLogin();                                                                                   // 67
      }                                                                                                                // 68
    });                                                                                                                // 69
};                                                                                                                     // 70
                                                                                                                       // 71
Template._resetPasswordDialog.inResetPasswordFlow = function () {                                                      // 72
  return loginButtonsSession.get('resetPasswordToken');                                                                // 73
};                                                                                                                     // 74
                                                                                                                       // 75
//                                                                                                                     // 76
// justResetPasswordDialog template                                                                                    // 77
//                                                                                                                     // 78
                                                                                                                       // 79
Template._justResetPasswordDialog.events({                                                                             // 80
  'click #just-verified-dismiss-button': function () {                                                                 // 81
    loginButtonsSession.set('justResetPassword', false);                                                               // 82
  }                                                                                                                    // 83
});                                                                                                                    // 84
                                                                                                                       // 85
Template._justResetPasswordDialog.visible = function () {                                                              // 86
  return loginButtonsSession.get('justResetPassword');                                                                 // 87
};                                                                                                                     // 88
                                                                                                                       // 89
Template._justResetPasswordDialog.displayName = displayName;                                                           // 90
                                                                                                                       // 91
                                                                                                                       // 92
                                                                                                                       // 93
//                                                                                                                     // 94
// enrollAccountDialog template                                                                                        // 95
//                                                                                                                     // 96
                                                                                                                       // 97
Template._enrollAccountDialog.events({                                                                                 // 98
  'click #login-buttons-enroll-account-button': function () {                                                          // 99
    enrollAccount();                                                                                                   // 100
  },                                                                                                                   // 101
  'keypress #enroll-account-password': function (event) {                                                              // 102
    if (event.keyCode === 13)                                                                                          // 103
      enrollAccount();                                                                                                 // 104
  },                                                                                                                   // 105
  'click #login-buttons-cancel-enroll-account': function () {                                                          // 106
    loginButtonsSession.set('enrollAccountToken', null);                                                               // 107
    Accounts._enableAutoLogin();                                                                                       // 108
  }                                                                                                                    // 109
});                                                                                                                    // 110
                                                                                                                       // 111
var enrollAccount = function () {                                                                                      // 112
  loginButtonsSession.resetMessages();                                                                                 // 113
  var password = document.getElementById('enroll-account-password').value;                                             // 114
  if (!validatePassword(password))                                                                                     // 115
    return;                                                                                                            // 116
                                                                                                                       // 117
  Accounts.resetPassword(                                                                                              // 118
    loginButtonsSession.get('enrollAccountToken'), password,                                                           // 119
    function (error) {                                                                                                 // 120
      if (error) {                                                                                                     // 121
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 122
      } else {                                                                                                         // 123
        loginButtonsSession.set('enrollAccountToken', null);                                                           // 124
        Accounts._enableAutoLogin();                                                                                   // 125
      }                                                                                                                // 126
    });                                                                                                                // 127
};                                                                                                                     // 128
                                                                                                                       // 129
Template._enrollAccountDialog.inEnrollAccountFlow = function () {                                                      // 130
  return loginButtonsSession.get('enrollAccountToken');                                                                // 131
};                                                                                                                     // 132
                                                                                                                       // 133
                                                                                                                       // 134
//                                                                                                                     // 135
// justVerifiedEmailDialog template                                                                                    // 136
//                                                                                                                     // 137
                                                                                                                       // 138
Template._justVerifiedEmailDialog.events({                                                                             // 139
  'click #just-verified-dismiss-button': function () {                                                                 // 140
    loginButtonsSession.set('justVerifiedEmail', false);                                                               // 141
  }                                                                                                                    // 142
});                                                                                                                    // 143
                                                                                                                       // 144
Template._justVerifiedEmailDialog.visible = function () {                                                              // 145
  return loginButtonsSession.get('justVerifiedEmail');                                                                 // 146
};                                                                                                                     // 147
                                                                                                                       // 148
Template._justVerifiedEmailDialog.displayName = displayName;                                                           // 149
                                                                                                                       // 150
                                                                                                                       // 151
//                                                                                                                     // 152
// loginButtonsMessagesDialog template                                                                                 // 153
//                                                                                                                     // 154
                                                                                                                       // 155
Template._loginButtonsMessagesDialog.events({                                                                          // 156
  'click #messages-dialog-dismiss-button': function () {                                                               // 157
    loginButtonsSession.resetMessages();                                                                               // 158
  }                                                                                                                    // 159
});                                                                                                                    // 160
                                                                                                                       // 161
Template._loginButtonsMessagesDialog.visible = function () {                                                           // 162
  var hasMessage = loginButtonsSession.get('infoMessage') || loginButtonsSession.get('errorMessage');                  // 163
  return !dropdown() && hasMessage;                                                                                    // 164
};                                                                                                                     // 165
                                                                                                                       // 166
                                                                                                                       // 167
//                                                                                                                     // 168
// configureLoginServiceDialog template                                                                                // 169
//                                                                                                                     // 170
                                                                                                                       // 171
Template._configureLoginServiceDialog.events({                                                                         // 172
  'click .configure-login-service-dismiss-button': function () {                                                       // 173
    loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                              // 174
  },                                                                                                                   // 175
  'click #configure-login-service-dialog-save-configuration': function () {                                            // 176
    if (loginButtonsSession.get('configureLoginServiceDialogVisible') &&                                               // 177
        ! loginButtonsSession.get('configureLoginServiceDialogSaveDisabled')) {                                        // 178
      // Prepare the configuration document for this login service                                                     // 179
      var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                             // 180
      var configuration = {                                                                                            // 181
        service: serviceName                                                                                           // 182
      };                                                                                                               // 183
                                                                                                                       // 184
      // Fetch the value of each input field                                                                           // 185
      _.each(configurationFields(), function(field) {                                                                  // 186
        configuration[field.property] = document.getElementById(                                                       // 187
          'configure-login-service-dialog-' + field.property).value                                                    // 188
          .replace(/^\s*|\s*$/g, ""); // trim() doesnt work on IE8;                                                    // 189
      });                                                                                                              // 190
                                                                                                                       // 191
      configuration.loginStyle =                                                                                       // 192
        $('#configure-login-service-dialog input[name="loginStyle"]:checked')                                          // 193
        .val();                                                                                                        // 194
                                                                                                                       // 195
      // Configure this login service                                                                                  // 196
      Accounts.connection.call(                                                                                        // 197
        "configureLoginService", configuration, function (error, result) {                                             // 198
          if (error)                                                                                                   // 199
            Meteor._debug("Error configuring login service " + serviceName,                                            // 200
                          error);                                                                                      // 201
          else                                                                                                         // 202
            loginButtonsSession.set('configureLoginServiceDialogVisible',                                              // 203
                                    false);                                                                            // 204
        });                                                                                                            // 205
    }                                                                                                                  // 206
  },                                                                                                                   // 207
  // IE8 doesn't support the 'input' event, so we'll run this on the keyup as                                          // 208
  // well. (Keeping the 'input' event means that this also fires when you use                                          // 209
  // the mouse to change the contents of the field, eg 'Cut' menu item.)                                               // 210
  'input, keyup input': function (event) {                                                                             // 211
    // if the event fired on one of the configuration input fields,                                                    // 212
    // check whether we should enable the 'save configuration' button                                                  // 213
    if (event.target.id.indexOf('configure-login-service-dialog') === 0)                                               // 214
      updateSaveDisabled();                                                                                            // 215
  }                                                                                                                    // 216
});                                                                                                                    // 217
                                                                                                                       // 218
// check whether the 'save configuration' button should be enabled.                                                    // 219
// this is a really strange way to implement this and a Forms                                                          // 220
// Abstraction would make all of this reactive, and simpler.                                                           // 221
var updateSaveDisabled = function () {                                                                                 // 222
  var anyFieldEmpty = _.any(configurationFields(), function(field) {                                                   // 223
    return document.getElementById(                                                                                    // 224
      'configure-login-service-dialog-' + field.property).value === '';                                                // 225
  });                                                                                                                  // 226
                                                                                                                       // 227
  loginButtonsSession.set('configureLoginServiceDialogSaveDisabled', anyFieldEmpty);                                   // 228
};                                                                                                                     // 229
                                                                                                                       // 230
// Returns the appropriate template for this login service.  This                                                      // 231
// template should be defined in the service's package                                                                 // 232
var configureLoginServiceDialogTemplateForService = function () {                                                      // 233
  var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                                 // 234
  // XXX Service providers should be able to specify their configuration                                               // 235
  // template name.                                                                                                    // 236
  return Template['configureLoginServiceDialogFor' +                                                                   // 237
                  (serviceName === 'meteor-developer' ?                                                                // 238
                   'MeteorDeveloper' :                                                                                 // 239
                   capitalize(serviceName))];                                                                          // 240
};                                                                                                                     // 241
                                                                                                                       // 242
var configurationFields = function () {                                                                                // 243
  var template = configureLoginServiceDialogTemplateForService();                                                      // 244
  return template.fields();                                                                                            // 245
};                                                                                                                     // 246
                                                                                                                       // 247
Template._configureLoginServiceDialog.configurationFields = function () {                                              // 248
  return configurationFields();                                                                                        // 249
};                                                                                                                     // 250
                                                                                                                       // 251
Template._configureLoginServiceDialog.visible = function () {                                                          // 252
  return loginButtonsSession.get('configureLoginServiceDialogVisible');                                                // 253
};                                                                                                                     // 254
                                                                                                                       // 255
Template._configureLoginServiceDialog.configurationSteps = function () {                                               // 256
  // renders the appropriate template                                                                                  // 257
  return configureLoginServiceDialogTemplateForService();                                                              // 258
};                                                                                                                     // 259
                                                                                                                       // 260
Template._configureLoginServiceDialog.saveDisabled = function () {                                                     // 261
  return loginButtonsSession.get('configureLoginServiceDialogSaveDisabled');                                           // 262
};                                                                                                                     // 263
                                                                                                                       // 264
// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                         // 265
var capitalize = function(str){                                                                                        // 266
  str = str == null ? '' : String(str);                                                                                // 267
  return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 268
};                                                                                                                     // 269
                                                                                                                       // 270
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-ui-unstyled'] = {};

})();
