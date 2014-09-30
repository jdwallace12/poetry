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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Template;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/templating/templating.js                                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
// Packages and apps add templates on to this object.                                                           // 2
                                                                                                                // 3
/**                                                                                                             // 4
 * @summary The class for defining templates                                                                    // 5
 * @class                                                                                                       // 6
 * @instanceName Template.myTemplate                                                                            // 7
 */                                                                                                             // 8
Template = Blaze.Template;                                                                                      // 9
                                                                                                                // 10
// Check for duplicate template names and illegal names that won't work.                                        // 11
Template.__checkName = function (name) {                                                                        // 12
  if (name in Template) {                                                                                       // 13
    if ((Template[name] instanceof Template) && name !== "body")                                                // 14
      throw new Error("There are multiple templates named '" + name + "'. Each template needs a unique name."); // 15
    throw new Error("This template name is reserved: " + name);                                                 // 16
  }                                                                                                             // 17
};                                                                                                              // 18
                                                                                                                // 19
// XXX COMPAT WITH 0.8.3                                                                                        // 20
Template.__define__ = function (name, renderFunc) {                                                             // 21
  Template.__checkName(name);                                                                                   // 22
  Template[name] = new Template("Template." + name, renderFunc);                                                // 23
};                                                                                                              // 24
                                                                                                                // 25
// Define a template `Template.body` that renders its                                                           // 26
// `contentViews`.  `<body>` tags (of which there may be                                                        // 27
// multiple) will have their contents added to it.                                                              // 28
                                                                                                                // 29
/**                                                                                                             // 30
 * @summary The [template object](#templates_api) representing your `<body>` tag.                               // 31
 * @locus Client                                                                                                // 32
 */                                                                                                             // 33
Template.body = new Template('body', function () {                                                              // 34
  var parts = Template.body.contentViews;                                                                       // 35
  // enable lookup by setting `view.template`                                                                   // 36
  for (var i = 0; i < parts.length; i++)                                                                        // 37
    parts[i].template = Template.body;                                                                          // 38
  return parts;                                                                                                 // 39
});                                                                                                             // 40
Template.body.contentViews = []; // array of Blaze.Views                                                        // 41
Template.body.view = null;                                                                                      // 42
                                                                                                                // 43
Template.body.addContent = function (renderFunc) {                                                              // 44
  var kind = 'body_content_' + Template.body.contentViews.length;                                               // 45
                                                                                                                // 46
  Template.body.contentViews.push(Blaze.View(kind, renderFunc));                                                // 47
};                                                                                                              // 48
                                                                                                                // 49
// This function does not use `this` and so it may be called                                                    // 50
// as `Meteor.startup(Template.body.renderIntoDocument)`.                                                       // 51
Template.body.renderToDocument = function () {                                                                  // 52
  // Only do it once.                                                                                           // 53
  if (Template.body.view)                                                                                       // 54
    return;                                                                                                     // 55
                                                                                                                // 56
  var view = UI.render(Template.body, document.body);                                                           // 57
  Template.body.view = view;                                                                                    // 58
};                                                                                                              // 59
                                                                                                                // 60
// XXX COMPAT WITH 0.9.0                                                                                        // 61
UI.body = Template.body;                                                                                        // 62
                                                                                                                // 63
// XXX COMPAT WITH 0.9.0                                                                                        // 64
// (<body> tags in packages built with 0.9.0)                                                                   // 65
Template.__body__ = Template.body;                                                                              // 66
Template.__body__.__contentParts = Template.body.contentViews;                                                  // 67
Template.__body__.__instantiate = Template.body.renderToDocument;                                               // 68
                                                                                                                // 69
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.templating = {
  Template: Template
};

})();
