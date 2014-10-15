(function(){
Template.body.addContent((function() {
  var view = this;
  return [ HTML.DIV({
    "class": "chat-wrap"
  }, "\n           ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return "\n           ";
  }, function() {
    return [ "\n        ", HTML.DIV({
      "class": "signin"
    }, "\n          ", Spacebars.include(view.lookupTemplate("loginButtons")), "\n      "), "\n      " ];
  }), "\n        ", HTML.Raw('<a href="#" id="close_chat"><p class="pull-right" style="position: relative; top: 17px; margin-top:-13px; right:15px; color:#969696;">x</p></a>'), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("input")), "\n        " ];
  }), "\n\n        ", HTML.DIV({
    "class": "message-wrap"
  }, "\n            ", Spacebars.include(view.lookupTemplate("messages")), "\n        "), "\n    "), HTML.Raw('\n    <div class="chat-open">\n        <p>Chat</p>\n    </div>\n    '), HTML.DIV({
    id: "wrap"
  }, "\n        ", Spacebars.include(view.lookupTemplate("list")), "\n        ", HTML.DIV({
    id: "footer"
  }, "\n            ", Spacebars.include(view.lookupTemplate("wordForm")), "\n        "), "\n    ") ];
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
  return HTML.Raw('<fieldset>\n        <form>\n            <div>\n                <label>\n                    <input id="name_of_word" placeholder="Enter a word and press enter">\n                </label>\n            </div>\n        </form>\n    </fieldset>\n    <div class="clear-form">\n        <p id="delete">Clear Board</p>\n    </div>');
}));

Template.__checkName("input");
Template["input"] = new Template("Template.input", (function() {
  var view = this;
  return HTML.Raw('<div id="input" class="well" style="margin-top: -17px;">\n        <strong>Your message</strong>\n        <input type="text" class="input-xlarge" rows="3" id="newMessage" style="width:80%;">\n        <a class="btn btn-primary" type="button" id="send">Send</a> \n        <a class="btn btn-danger" style="margin-top: -10px;" type="button" id="delete_chat">Clear Chat</a>          \n    </div>');
}));

Template.__checkName("messages");
Template["messages"] = new Template("Template.messages", (function() {
  var view = this;
  return HTML.DIV({
    id: "messages"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messages"));
  }, function() {
    return [ " \n        ", Spacebars.include(view.lookupTemplate("message")), " \n        " ];
  }), "\n    ");
}));

Template.__checkName("message");
Template["message"] = new Template("Template.message", (function() {
  var view = this;
  return HTML.DIV({
    "class": "chat-room-message-wrap"
  }, "\n       ", HTML.P({
    "class": "message-text"
  }, " ", HTML.STRONG(Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("user"), "username"));
  }), ":")), " ", HTML.P({
    "class": "message-text"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("message"));
  })), "\n    ");
}));

})();
