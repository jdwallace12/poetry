Template.list.magnets = function () {
  //mongo syntax for finding everythign in Appliaations
  return Magnets.find({}, {sort: {votes: -1}});
};

Template.list.selected = function() {
  if (Session.get('currentMagnet') === this._id)
    return "selected";
  else
    return "";
};

Template.list.magnetId = function() {
  return this._id;
};

Template.list.events = {
  'click div.magnet' : function () { 
      Session.set('currentMagnet', this._id); 
    },
  // 'click input.vote' : function() { 
  //     Magnets.update( Session.get('currentMagnet'), 
  //         {$inc: {votes: 1}}); 
  //   }
  'mouseover div.magnet': function (e) {
    var $magnet = $(e.currentTarget);
     
    if (!$magnet.data('isDraggable')) {
      $magnet.data('isDraggable', true).draggable({distance: 3});
    }
  } 
};


$(function () {

  var prevDraggedId = '';
  var prevDraggedTime = 0;


  $('body').on('drag', '.magnet', function (e) {
    var now = new Date().getTime();
    var magnetId;

    $(e.target).addClass('selected');

    if (e.target.id != prevDraggedId) {
      magnetId = e.target.id;
      elevate(magnetId);
      prevDraggedId = e.target.id;
    }
    
    if (now - prevDraggedTime > 1000) {
      if (!magnetId) {
        magnetId = e.target.id;
      }
      dragged(magnetId, $(e.target).position());
      prevDraggedTime = now;
    }
  });
  
  $('body').on('dragstop', '.magnet', function (e) {
    $(e.target).removeClass('selected');
    var magnetId = e.target.id;
    elevate(magnetId);
    dragged(magnetId, $(e.target).position());
    prevDraggedId = '';
    deelevate(magnetId);
  });

  function dragged (magnetId, position) {
    Magnets.update({_id: magnetId}, {$set: {top: position.top, left: position.left}});
  }

  function elevate (magnetId) {
    maxZIndex = 100;
    Magnets.update(magnetId, {$set: {z_index: maxZIndex}});
  }

  function deelevate (magnetId) {
    Magnets.update(magnetId, {$set: {z_index: 0}});
  }
})


