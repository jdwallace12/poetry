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

//delete magnets
Template.home.events = {
    'click #delete': function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want delete all the Magnets?')) {
            Meteor.call('removeAllMagnets');         
        }
    },
    //devop magnets

    'click #devops-magnets': function(e) {
        e.preventDefault();
        if (confirm('Switch to DevOps Magnets?')) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

                Meteor.call('devopsMagnetsMobile');
            } else {
                Meteor.call('devopsMagnets');
            }
        }
    },
    //developer magnets
    'click #developer-magnets': function(e) {
        e.preventDefault();
        if (confirm('Switch to Developer Magnets?')) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

                Meteor.call('developerMagnetsMobile');
            } else {
                Meteor.call('developerMagnets');
            }
        }
    },
       //both sets of  magnets
    'click #all-magnets': function(e) {
        e.preventDefault();
        if (confirm('Use all the Magnets?')) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

                Meteor.call('allMagnetsMobile');
            } else {
                Meteor.call('allMagnets');
            }
        }
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
                // containment: ".board-wrapper",
                snap: true,
                snapTolerance: 30
            });
            $(".fridge").droppable({
                accept: '.magnet',

                drop: function(event, ui) {
                    var slap = $('#slap')[0]
                    slap.play();

                }
            });

        }
    }
};



Meteor.startup(function() {});
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
