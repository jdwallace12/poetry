(function(){
Template.body.addContent((function() {
  var view = this;
  return [ HTML.DIV({
    "class": "chat-wrap"
  }, "\n        ", Spacebars.include(view.lookupTemplate("input")), "\n        ", Spacebars.include(view.lookupTemplate("messages")), "\n    "), "\n    ", HTML.DIV({
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
    return [ " \n        ", Spacebars.include(view.lookupTemplate("magnet")), "\n         " ];
  }, function() {
    return " \n         ";
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

Template.__checkName("input");
Template["input"] = new Template("Template.input", (function() {
  var view = this;
  return HTML.DIV({
    id: "input",
    "class": "well"
  }, HTML.Raw("\n        <strong>Your message</strong>\n        "), HTML.TEXTAREA({
    "class": "input-xlarge",
    rows: "3",
    id: "newMessage"
  }), HTML.Raw('\n        <input type="text" class="input-xlarge" placeholder="Your name..." id="username">\n        <a class="btn btn-primary" id="send">Send</a>\n    '));
}));

Template.__checkName("messages");
Template["messages"] = new Template("Template.messages", (function() {
  var view = this;
  return HTML.DIV({
    id: "messages"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messages"));
  }, function() {
    return [ "\n            ", Spacebars.include(view.lookupTemplate("message")), "\n        " ];
  }), "\n    ");
}));

Template.__checkName("message");
Template["message"] = new Template("Template.message", (function() {
  var view = this;
  return HTML.BLOCKQUOTE("\n        ", HTML.P(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("message"));
  })), "\n        ", HTML.SMALL(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("username"));
  })), "\n    ");
}));

})();
