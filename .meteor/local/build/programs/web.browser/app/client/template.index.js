(function(){
Template.body.addContent((function() {
  var view = this;
  return [ HTML.Raw('<div class="chat-trigger">\n   <button type="button" id="chat-box-trigger" class="btn btn-success">Chat</button>\n    </div>\n    '), HTML.DIV({
    "class": "chat-wrap"
  }, "\n        ", HTML.Raw('<button type="button" id="close" class="btn btn-default pull-right">Close</button>'), "\n      ", Spacebars.include(view.lookupTemplate("mainBox")), "\n  "), "\n    ", HTML.DIV({
    id: "wrap"
  }, "\n        ", Spacebars.include(view.lookupTemplate("list")), "\n        ", HTML.DIV({
    id: "footer"
  }, "\n            ", Spacebars.include(view.lookupTemplate("wordForm")), "\n            \n        "), "\n    ") ];
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("list");
Template["list"] = new Template("Template.list", (function() {
  var view = this;
  return HTML.DIV({
    id: "outer"
  }, HTML.Raw('\n        <!--  <input type="button" value="init draggables for touch" class="init btn"/>\n    <br>\n    <br> -->\n        <!-- <h1 id="header">Magnetic Poetry</h1> -->\n        '), Blaze.Each(function() {
    return Spacebars.call(view.lookup("magnets"));
  }, function() {
    return [ " ", Spacebars.include(view.lookupTemplate("magnet")), " " ];
  }, function() {
    return " ";
  }), "\n    ");
}));

Template.__checkName("magnet");
Template["magnet"] = new Template("Template.magnet", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "magnet ", Spacebars.mustache(view.lookup("selected")), " ui-draggable" ];
    },
    id: function() {
      return Spacebars.mustache(view.lookup("magnetId"));
    },
    style: function() {
      return [ "top: ", Spacebars.mustache(view.lookup("top")), "px; left: ", Spacebars.mustache(view.lookup("left")), "px;" ];
    }
  }, "\n        ", HTML.DIV({
    "class": "name"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  })), "\n    ");
}));

Template.__checkName("wordForm");
Template["wordForm"] = new Template("Template.wordForm", (function() {
  var view = this;
  return HTML.Raw('<fieldset>\n        <form>\n            <div>\n                <label>\n                    <input id="name_of_word" placeholder="Enter a word and press enter">\n                </label>\n            </div>\n        </form>\n    </fieldset>\n    <div class="clear-form">\n                <p id="delete">Clear Board</p>\n            </div>');
}));

})();
