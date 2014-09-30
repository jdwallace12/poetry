(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var SpacebarsCompiler = Package['spacebars-compiler'].SpacebarsCompiler;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;

/* Package-scope variables */
var Boilerplate;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/boilerplate-generator/boilerplate-generator.js                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var fs = Npm.require('fs');                                                      // 1
var Future = Npm.require('fibers/future');                                       // 2
var path = Npm.require('path');                                                  // 3
                                                                                 // 4
// Copied from webapp_server                                                     // 5
var readUtf8FileSync = function (filename) {                                     // 6
  return Future.wrap(fs.readFile)(filename, 'utf8').wait();                      // 7
};                                                                               // 8
                                                                                 // 9
Boilerplate = function (arch, manifest, options) {                               // 10
  var self = this;                                                               // 11
  options = options || {};                                                       // 12
  self.template = _getTemplate(arch);                                            // 13
  self.baseData = null;                                                          // 14
  self.func = null;                                                              // 15
                                                                                 // 16
  self._generateBoilerplateFromManifestAndSource(                                // 17
    manifest,                                                                    // 18
    self.template,                                                               // 19
    options                                                                      // 20
  );                                                                             // 21
};                                                                               // 22
                                                                                 // 23
// The 'extraData' argument can be used to extend 'self.baseData'. Its           // 24
// purpose is to allow you to specify data that you might not know at            // 25
// the time that you construct the Boilerplate object. (e.g. it is used          // 26
// by 'webapp' to specify data that is only known at request-time).              // 27
Boilerplate.prototype.toHTML = function (extraData) {                            // 28
  var self = this;                                                               // 29
                                                                                 // 30
  if (! self.baseData || ! self.func)                                            // 31
    throw new Error('Boilerplate did not instantiate correctly.');               // 32
                                                                                 // 33
  return  "<!DOCTYPE html>\n" +                                                  // 34
    Blaze.toHTML(Blaze.With(_.extend(self.baseData, extraData),                  // 35
                            self.func));                                         // 36
};                                                                               // 37
                                                                                 // 38
// XXX Exported to allow client-side only changes to rebuild the boilerplate     // 39
// without requiring a full server restart.                                      // 40
// Produces an HTML string with given manifest and boilerplateSource.            // 41
// Optionally takes urlMapper in case urls from manifest need to be prefixed     // 42
// or rewritten.                                                                 // 43
// Optionally takes pathMapper for resolving relative file system paths.         // 44
// Optionally allows to override fields of the data context.                     // 45
Boilerplate.prototype._generateBoilerplateFromManifestAndSource =                // 46
  function (manifest, boilerplateSource, options) {                              // 47
    var self = this;                                                             // 48
    // map to the identity by default                                            // 49
    var urlMapper = options.urlMapper || _.identity;                             // 50
    var pathMapper = options.pathMapper || _.identity;                           // 51
                                                                                 // 52
    var boilerplateBaseData = {                                                  // 53
      css: [],                                                                   // 54
      js: [],                                                                    // 55
      head: '',                                                                  // 56
      body: '',                                                                  // 57
      meteorManifest: JSON.stringify(manifest)                                   // 58
    };                                                                           // 59
                                                                                 // 60
    // allow the caller to extend the default base data                          // 61
    _.extend(boilerplateBaseData, options.baseDataExtension);                    // 62
                                                                                 // 63
    _.each(manifest, function (item) {                                           // 64
      var urlPath = urlMapper(item.url);                                         // 65
      var itemObj = { url: urlPath };                                            // 66
                                                                                 // 67
      if (options.inline) {                                                      // 68
        itemObj.scriptContent = readUtf8FileSync(                                // 69
          pathMapper(item.path));                                                // 70
        itemObj.inline = true;                                                   // 71
      }                                                                          // 72
                                                                                 // 73
      if (item.type === 'css' && item.where === 'client') {                      // 74
        boilerplateBaseData.css.push(itemObj);                                   // 75
      }                                                                          // 76
      if (item.type === 'js' && item.where === 'client') {                       // 77
        boilerplateBaseData.js.push(itemObj);                                    // 78
      }                                                                          // 79
      if (item.type === 'head') {                                                // 80
        boilerplateBaseData.head =                                               // 81
          readUtf8FileSync(pathMapper(item.path));                               // 82
      }                                                                          // 83
      if (item.type === 'body') {                                                // 84
        boilerplateBaseData.body =                                               // 85
          readUtf8FileSync(pathMapper(item.path));                               // 86
      }                                                                          // 87
    });                                                                          // 88
    var boilerplateRenderCode = SpacebarsCompiler.compile(                       // 89
      boilerplateSource, { isBody: true });                                      // 90
                                                                                 // 91
    // Note that we are actually depending on eval's local environment capture   // 92
    // so that UI and HTML are visible to the eval'd code.                       // 93
    // XXX the template we are evaluating relies on the fact that UI is globally // 94
      // available.                                                              // 95
    global.UI = UI;                                                              // 96
    self.func = eval(boilerplateRenderCode);                                     // 97
    self.baseData = boilerplateBaseData;                                         // 98
};                                                                               // 99
                                                                                 // 100
var _getTemplate = _.memoize(function (arch) {                                   // 101
  var filename = 'boilerplate_' + arch + '.html';                                // 102
  return Assets.getText(filename);                                               // 103
});                                                                              // 104
                                                                                 // 105
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['boilerplate-generator'] = {
  Boilerplate: Boilerplate
};

})();
