
Meteor.methods({
  'vote': function(appId) {
    if (!Meteor.user())
      return;
    
    Applications.update(appId, 
                        {$inc: {votes:1},
                        $addToSet: { voters: Meteor.user().services.faceboook.username}
                      });
  }});
