(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var Autoupdate, ClientVersions;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/autoupdate/autoupdate_server.js                                      //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// Publish the current client versions to the client.  When a client             // 1
// sees the subscription change and that there is a new version of the           // 2
// client available on the server, it can reload.                                // 3
//                                                                               // 4
// By default there are two current client versions. The refreshable client      // 5
// version is identified by a hash of the client resources seen by the browser   // 6
// that are refreshable, such as CSS, while the non refreshable client version   // 7
// is identified by a hash of the rest of the client assets                      // 8
// (the HTML, code, and static files in the `public` directory).                 // 9
//                                                                               // 10
// If the environment variable `AUTOUPDATE_VERSION` is set it will be            // 11
// used as the client id instead.  You can use this to control when              // 12
// the client reloads.  For example, if you want to only force a                 // 13
// reload on major changes, you can use a custom AUTOUPDATE_VERSION              // 14
// which you only change when something worth pushing to clients                 // 15
// immediately happens.                                                          // 16
//                                                                               // 17
// The server publishes a `meteor_autoupdate_clientVersions`                     // 18
// collection. There are two documents in this collection, a document            // 19
// with _id 'version' which represnets the non refreshable client assets,        // 20
// and a document with _id 'version-refreshable' which represents the            // 21
// refreshable client assets. Each document has a 'version' field                // 22
// which is equivalent to the hash of the relevant assets. The refreshable       // 23
// document also contains a list of the refreshable assets, so that the client   // 24
// can swap in the new assets without forcing a page refresh. Clients can        // 25
// observe changes on these documents to detect when there is a new              // 26
// version available.                                                            // 27
//                                                                               // 28
// In this implementation only two documents are present in the collection       // 29
// the current refreshable client version and the current nonRefreshable client  // 30
// version.  Developers can easily experiment with different versioning and      // 31
// updating models by forking this package.                                      // 32
                                                                                 // 33
var Future = Npm.require("fibers/future");                                       // 34
                                                                                 // 35
Autoupdate = {};                                                                 // 36
                                                                                 // 37
// The collection of acceptable client versions.                                 // 38
ClientVersions = new Mongo.Collection("meteor_autoupdate_clientVersions",        // 39
  { connection: null });                                                         // 40
                                                                                 // 41
// The client hash includes __meteor_runtime_config__, so wait until             // 42
// all packages have loaded and have had a chance to populate the                // 43
// runtime config before using the client hash as our default auto               // 44
// update version id.                                                            // 45
                                                                                 // 46
// Note: Tests allow people to override Autoupdate.autoupdateVersion before      // 47
// startup.                                                                      // 48
Autoupdate.autoupdateVersion = null;                                             // 49
Autoupdate.autoupdateVersionRefreshable = null;                                  // 50
Autoupdate.autoupdateVersionCordova = null;                                      // 51
                                                                                 // 52
var syncQueue = new Meteor._SynchronousQueue();                                  // 53
                                                                                 // 54
// updateVersions can only be called after the server has fully loaded.          // 55
var updateVersions = function (shouldReloadClientProgram) {                      // 56
  // Step 1: load the current client program on the server and update the        // 57
  // hash values in __meteor_runtime_config__.                                   // 58
  if (shouldReloadClientProgram) {                                               // 59
    WebAppInternals.reloadClientPrograms();                                      // 60
  }                                                                              // 61
                                                                                 // 62
  // If we just re-read the client program, or if we don't have an autoupdate    // 63
  // version, calculate it.                                                      // 64
  if (shouldReloadClientProgram || Autoupdate.autoupdateVersion === null) {      // 65
    Autoupdate.autoupdateVersion =                                               // 66
      process.env.AUTOUPDATE_VERSION ||                                          // 67
      WebApp.calculateClientHashNonRefreshable();                                // 68
  }                                                                              // 69
  // If we just recalculated it OR if it was set by (eg) test-in-browser,        // 70
  // ensure it ends up in __meteor_runtime_config__.                             // 71
  __meteor_runtime_config__.autoupdateVersion =                                  // 72
    Autoupdate.autoupdateVersion;                                                // 73
                                                                                 // 74
  Autoupdate.autoupdateVersionRefreshable =                                      // 75
    __meteor_runtime_config__.autoupdateVersionRefreshable =                     // 76
      process.env.AUTOUPDATE_VERSION ||                                          // 77
      WebApp.calculateClientHashRefreshable();                                   // 78
                                                                                 // 79
    Autoupdate.autoupdateVersionCordova =                                        // 80
      __meteor_runtime_config__.autoupdateVersionCordova =                       // 81
        process.env.AUTOUPDATE_VERSION ||                                        // 82
        WebApp.calculateClientHashCordova();                                     // 83
                                                                                 // 84
  // Step 2: form the new client boilerplate which contains the updated          // 85
  // assets and __meteor_runtime_config__.                                       // 86
  if (shouldReloadClientProgram) {                                               // 87
    WebAppInternals.generateBoilerplate();                                       // 88
  }                                                                              // 89
                                                                                 // 90
  // XXX COMPAT WITH 0.8.3                                                       // 91
  if (! ClientVersions.findOne({current: true})) {                               // 92
    // To ensure apps with version of Meteor prior to 0.9.0 (in                  // 93
    // which the structure of documents in `ClientVersions` was                  // 94
    // different) also reload.                                                   // 95
    ClientVersions.insert({current: true});                                      // 96
  }                                                                              // 97
                                                                                 // 98
  if (! ClientVersions.findOne({_id: "version"})) {                              // 99
    ClientVersions.insert({                                                      // 100
      _id: "version",                                                            // 101
      version: Autoupdate.autoupdateVersion                                      // 102
    });                                                                          // 103
  } else {                                                                       // 104
    ClientVersions.update("version", { $set: {                                   // 105
      version: Autoupdate.autoupdateVersion                                      // 106
    }});                                                                         // 107
  }                                                                              // 108
                                                                                 // 109
  if (! ClientVersions.findOne({_id: "version-refreshable"})) {                  // 110
    ClientVersions.insert({                                                      // 111
      _id: "version-refreshable",                                                // 112
      version: Autoupdate.autoupdateVersionRefreshable,                          // 113
      assets: WebAppInternals.refreshableAssets                                  // 114
    });                                                                          // 115
  } else {                                                                       // 116
    ClientVersions.update("version-refreshable", { $set: {                       // 117
      version: Autoupdate.autoupdateVersionRefreshable,                          // 118
      assets: WebAppInternals.refreshableAssets                                  // 119
      }});                                                                       // 120
  }                                                                              // 121
                                                                                 // 122
  if (! ClientVersions.findOne({_id: "version-cordova"})) {                      // 123
    ClientVersions.insert({                                                      // 124
      _id: "version-cordova",                                                    // 125
      version: Autoupdate.autoupdateVersionCordova,                              // 126
      refreshable: false                                                         // 127
    });                                                                          // 128
  } else {                                                                       // 129
    ClientVersions.update("version-cordova", { $set: {                           // 130
      version: Autoupdate.autoupdateVersionCordova                               // 131
    }});                                                                         // 132
  }                                                                              // 133
};                                                                               // 134
                                                                                 // 135
Meteor.publish(                                                                  // 136
  "meteor_autoupdate_clientVersions",                                            // 137
  function () {                                                                  // 138
    return ClientVersions.find();                                                // 139
  },                                                                             // 140
  {is_auto: true}                                                                // 141
);                                                                               // 142
                                                                                 // 143
Meteor.startup(function () {                                                     // 144
  updateVersions(false);                                                         // 145
});                                                                              // 146
                                                                                 // 147
var fut = new Future();                                                          // 148
                                                                                 // 149
// We only want SIGUSR2 to trigger 'updateVersions' AFTER onListen,              // 150
// so we add a queued task that waits for onListen before SIGUSR2 can queue      // 151
// tasks. Note that the `onListening` callbacks do not fire until after          // 152
// Meteor.startup, so there is no concern that the 'updateVersions' calls        // 153
// from SIGUSR2 will overlap with the `updateVersions` call from Meteor.startup. // 154
                                                                                 // 155
syncQueue.queueTask(function () {                                                // 156
  fut.wait();                                                                    // 157
});                                                                              // 158
                                                                                 // 159
WebApp.onListening(function () {                                                 // 160
  fut.return();                                                                  // 161
});                                                                              // 162
                                                                                 // 163
// Listen for SIGUSR2, which signals that a client asset has changed.            // 164
process.on('SIGUSR2', Meteor.bindEnvironment(function () {                       // 165
  syncQueue.queueTask(function () {                                              // 166
    updateVersions(true);                                                        // 167
  });                                                                            // 168
}));                                                                             // 169
                                                                                 // 170
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();
