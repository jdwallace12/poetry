(function(){Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
});

Template.list.magnets = function() {
    //mongo syntax for finding everythign in Appliaations
    return Magnets.find({}, {
        sort: {
            votes: -1
        }
    });
};

Template.magnet.selected = function() {
    if (Session.get('currentMagnet') === this._id)
        return "selected";
    else
        return "";
};

Template.magnet.magnetId = function() {
    return this._id;
};


// Handle wordForm events
Template.wordForm.events = {
    'submit': function(e, tmpl) {
        // Don't postback
        e.preventDefault();
        // add the word to the db     
        Magnets.insert({
            name: tmpl.find("#name_of_word").value,
            top: Math.floor(Random.fraction() * 100) * 7,
            left: Math.floor(Random.fraction() * 100) * 8
        });
        $("#name_of_word").val("");
    }
};


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

Template.magnet.events = {
    'mouseover div.magnet': function(e, template) {
        var $magnet = $(e.currentTarget);

        if (!$magnet.data('isDraggable')) {
            $magnet.data('isDraggable', true).draggable({
                distance: 3,
                handle: '.name',
                cursor: 'move',
                snap: true,
                snapTolerance: 25
            });
        }
    }
};


Meteor.startup(function() {
});
$(function() {


    var prevDraggedId = '';
    var prevDraggedTime = 0;


    $('body').on('drag', '.magnet', function(e) {
        var now = new Date().getTime();
        var magnetId;
        Session.set('currentMagnet', e.target.id);

        if (e.target.id != prevDraggedId) {
            magnetId = Session.get('currentMagnet');
            elevate(magnetId);
            prevDraggedId = magnetId;
        }

        if (now - prevDraggedTime > 1000) {
            if (!magnetId) {
                magnetId = magnetId;
            }
            dragged(magnetId, $(e.target).position());
            prevDraggedTime = now;
        }
    });

    $('body').on('dragstop', '.magnet', function(e) {
        var magnetId = e.target.id;
        elevate(magnetId);
        dragged(magnetId, $(e.target).position());
        prevDraggedId = '';
        deelevate(magnetId);
    });

    function dragged(magnetId, position) {
        Magnets.update({
            _id: magnetId
        }, {
            $set: {
                top: position.top,
                left: position.left
            }
        });
    }

    function elevate(magnetId) {
        maxZIndex = 100;
        Magnets.update(magnetId, {
            $set: {
                z_index: maxZIndex
            }
        });
    }

    function deelevate(magnetId) {
        Magnets.update(magnetId, {
            $set: {
                z_index: 0
            }
        });
    }

    $(document).keypress(function(event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $('#send').click();
        }
    });
});

})();
