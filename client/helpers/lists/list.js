Template.list.events = {
    'click input.init': function(e, template) {
        $('.magnet').draggable({
            distance: 3,
            handle: '.name',
            cursor: 'move',
            snap: true,
            snapTolerance: 25
        });
    }
};



Template.home.events = {
    'click #new-board': function() {
        var user = Meteor.userId();
        var magnet = Magnets.findOne();
        Magnets.update({_id: magnet._id}, {$set: {fridgeId: user}});
    }
};

Template.private.events = {
    'click #group-fridge': function() {
        var magnet = Magnets.findOne();
        Magnets.update({_id: magnet._id}, {$set: {fridgeId: 1}});
    }
};