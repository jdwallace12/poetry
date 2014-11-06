Messages = new Meteor.Collection("Messages");

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

    Template.input.userCount = function () {
    return Meteor.users.find().count();
};
        Template.input.magnetCount = function () {
    return Magnets.find().count();
};

    Template.home.user = function () {
    var user = Meteor.user();
    return user;
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
