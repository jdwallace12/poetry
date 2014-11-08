Magnets = new Meteor.Collection('magnets');
//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});

Fridge = new Meteor.Collection('fridge');


Magnets.helpers({
  fridge: function() {
    return Fridge.find();
  }
});


Magnets.allow({
insert: function () {
    return true;
},

update: function() {
    return true;    
}

});


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
