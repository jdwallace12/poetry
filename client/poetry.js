Applications = new Meteor.Collection('applications');

if (Meteor.isClient) {
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
}

if(Meteor.isServer) {
  Meteor.methods({
    'vote': function(appId) {
      if (!Meteor.user())
        return;
      Applications.update(appId, https://developers.facebook.com/apps?ref=mb
                          {$inc: {votes:1},
                          $addToSet: { voters: Meteor.user().services.faceboook.username}
                        });
    }});
}

//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});
