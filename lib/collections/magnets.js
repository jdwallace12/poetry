Magnets = new Meteor.Collection('magnets');
//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});

Fridge = new Meteor.Collection('fridge');


Fridge.allow({
    insert: function() {
        /* user and doc checks ,
        return true to allow insert */
        return true;
    }
});

Magnets.allow({
    insert: function() {
        return true;
    },

    update: function() {
        return true;
    }

});


if (Meteor.isClient) {
    Meteor.subscribe('magnets', function() {
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

    // UI.body.events({
    //     'click #make_room': function(e) {
    //         e.preventDefault();

    //         Meteor.call('moveMagnets');

    //     }

    // });

}


if (Meteor.isServer) {

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    Meteor.publish('magnets', function() {
        return Magnets.find();
    });


    Meteor.startup(function() {

        return Meteor.methods({

            removeAllMagnets: function() {

                return Magnets.remove({});

         }


            // moveMagnets: function() {
            //     var magnetId = Magnets.findOne({
            //         'magnetId': this._id
            //     });
            //     Magnets.update({
            //         _id: magnetId
            //     }, {
            //         $set: {
            //             top: Math.floor(Random.fraction() * 100) * 8,
            //             left: Math.floor(Random.fraction() * 100) * 3
            //         }
            //     });

            // }



        });

    });

}
