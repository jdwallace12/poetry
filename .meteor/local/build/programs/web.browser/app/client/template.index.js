(function(){
Template.body.addContent((function() {
  var view = this;
  return [ HTML.DIV({
    "class": "container",
    style: "position:relative;"
  }, "\n        ", HTML.Raw('<div class="navbar navbar-fixed-top navbar-inverse" style="background: #000;">\n\n\n   <ul class="nav">\n  <li class="active">\n    <a href="#">Home</a>\n  </li>\n  <li><a href="#">Link</a></li>\n  <li><a href="#">Link</a></li>\n</ul>\n</div>'), "\n", HTML.Raw('<!--     <div class="chat-wrap">\n        {{> header }}\n        {{#if currentUser}} \n        {{else}}\n        <div class="signin">\n            {{> loginButtons}}\n        </div>\n        {{/if}} \n        {{#if currentUser}} \n        {{> input}} \n        {{/if}} \n        {{> messages}}\n    </div> -->'), "\n ", HTML.Raw('<!--    <div class="chat-open">\n        <p>Chat</p>\n    </div>\n    <div class="footer-open">\n        <p>Add Words</p>\n    </div> -->'), "\n\n    ", Spacebars.include(view.lookupTemplate("list")), "\n    ", HTML.Raw('<div class="fridge">\n    </div>'), "\n\n     ", HTML.Raw('<audio id="slap" preload="metadata">\n                  <source src="/slap.wav">\n                </audio>'), "\n\n  ", HTML.Raw("<!--    {{>wordForm}} -->"), "\n"), HTML.Raw('\n<span class="st_facebook_large" displaytext="Facebook"></span>\n<span class="st_twitter_large" displaytext="Tweet"></span>\n<span class="st_linkedin_large" displaytext="LinkedIn"></span>\n<span class="st_fblike_large" displaytext="Facebook Like"></span>\n<span class="st_pinterest_large" displaytext="Pinterest"></span>\n<span class="st_email_large" displaytext="Email"></span>') ];
}));
Meteor.startup(Template.body.renderToDocument);

})();
