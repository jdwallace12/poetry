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
