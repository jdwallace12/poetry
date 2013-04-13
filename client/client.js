Template.list.apps = function () {
  //mongo syntax for finding everythign in Appliaations
  return Applications.find({}, {sort: {votes: -1}});
};

Template.list.selected = function() {
  if (Session.get('currentApp') === this._id)
    return "selected";
  else
    return "";
};

Template.list.events = {
  'click div.app' : function () { 
      console.log(this._id); 
      Session.set('currentApp', this._id); 
    },
  'click input.vote' : function() { 
      Applications.update( Session.get('currentApp'), 
          {$inc: {votes: 1}}); 
    }
};


