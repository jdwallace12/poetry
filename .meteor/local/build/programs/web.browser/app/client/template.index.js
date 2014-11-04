(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.SCRIPT({
    type: "text/javascript",
    src: "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5459272168788aab",
    async: "async"
  });
}));
Meteor.startup(Template.body.renderToDocument);

})();
