Messages = new Meteor.Collection("Messages");

Messages.allow({
insert: function () {
    return true;
},

update: function() {
    return true;    
}

});


if (Meteor.isClient) {

    Template.messages.messages = function() {
        return Messages.find({

        }, {
            sort: {
                timestamp: -1
            },
            limit: 20
        });
    };
    
    Template.home.user = function () {
        return Meteor.user();
    }


    Template.input.events({
        'click #send': function() {
            var message = $('#newMessage').val();

            var user = Meteor.user();
            Meteor.saveMessage({
                user: user,
                message: message
            });
        }
    });


Template.input.userOnline = function() {
var useronline = Meteor.users.find({ "status.online": true });
return useronline.count();

};

         

    Template.input.events({
        'click #delete_chat': function(messages) {
            if (confirm('Are you sure you want to delete the chat?')) {
                Meteor.call('removeAllMessages');
            }
        }
    });

    Meteor.autorun(function() {
        Meteor.subscribe("Messages");
    });

      Meteor.autorun(function() {
        Meteor.subscribe("userStatus");
    });

    Meteor.saveMessage = function(content) {
        var message = content.message;
        var user = Meteor.user();
        if (!message) {
            return;
        }
        Messages.insert({
            user: user,
            message: message,
            timestamp: Date.now()
        }, function(err, id) {
            if (err) {
                alert('Something defnitely went wrong!');
            }
            if (id) {
                $('#newMessage').val('');
                $('.chat-room-message-wrap:first-child').effect('highlight', {color: "#f1c40f;"}, 1000);
            }
        });
    };

}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup

    });

    Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

    Meteor.publish("Messages", function() {
        return Messages.find();
    });

    // Messages.allow({
    //   'insert': function(userId, doc) {
    //     return true;
    //   },
    //   'remove': function(userId, doc) {
    //     return false;
    //   }
    // });
}
