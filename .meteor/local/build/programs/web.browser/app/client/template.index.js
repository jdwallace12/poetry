(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.DIV({
    "class": "container",
    style: "position:relative;"
  }, HTML.Raw('\n        <div class="navbar navbar-fixed-top" style="background:#ccc;">\n\n\n   <ul class="nav">\n  <li class="active">\n    <a href="#">Home</a>\n  </li>\n  <li><a href="#">Link</a></li>\n  <li><a href="#">Link</a></li>\n</ul>\n</div>\n<!--     <div class="chat-wrap">\n        {{> header }}\n        {{#if currentUser}} \n        {{else}}\n        <div class="signin">\n            {{> loginButtons}}\n        </div>\n        {{/if}} \n        {{#if currentUser}} \n        {{> input}} \n        {{/if}} \n        {{> messages}}\n    </div> -->\n <!--    <div class="chat-open">\n        <p>Chat</p>\n    </div>\n    <div class="footer-open">\n        <p>Add Words</p>\n    </div> -->\n\n    '), Spacebars.include(view.lookupTemplate("list")), HTML.Raw('\n    <div class="fridge">\n    </div>\n\n  <!--    {{>wordForm}} -->\n'));
}));
Meteor.startup(Template.body.renderToDocument);

})();
