Magnets = new Meteor.Collection('magnets');
//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});

if (Meteor.isClient) {
    UI.body.events({
        'click #delete': function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete everything?')) {
                Meteor.call('removeAllMagnets');
            }
        }
    });
          $('#close_chat').on('click', function(){
        ('.chat-wrap').hide();
    });
}


if (Meteor.isServer) {
    Meteor.startup(function() {

        return Meteor.methods({

            removeAllMagnets: function() {

                return Magnets.remove({});

            }

        });

    });

}