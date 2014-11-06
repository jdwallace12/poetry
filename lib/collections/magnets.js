Magnets = new Meteor.Collection('magnets');
//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});

if (Meteor.isClient) {
    Meteor.subscribe('magnets', function(){
    return Magnets.find();
});

    UI.body.events({
        'click #delete': function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete everything?')) {
                Meteor.call('removeAllMagnets');
            }
        }
    });
}


if (Meteor.isServer) {

    Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

    Meteor.publish('magnets', function(){
    return Magnets.find();
});

    Meteor.startup(function() {

        return Meteor.methods({

            removeAllMagnets: function() {

                return Magnets.remove({});

            }

        });

    });

}
