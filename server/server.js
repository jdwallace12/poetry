Meteor.methods({
  'vote': function(magnetId) {
    if (!Meteor.user())
      return;
    
    Magnets.update(magnetId, 
                   {$inc: {votes:1},
                    $addToSet: { voters: Meteor.user().services.faceboook.username}
    });
  }, 
  'set_position': function(magnetId, position) {
    console.log(position)
    Magnets.update(magnetId, {$set: {top: position.top, left: position.left}});
  }

});

Meteor.startup(function () {
  console.log('Starting Magnets');
  console.log(Magnets.find().count());
  if (Magnets.find().count() < 3) {
    var words = ["hey", "time", "let's",
                 "love", "can", "awesome",
                 "poetry", "random", "best", 
                 "beer", "framework", "is", "are", "we", "you", "i", "they", 
                 "meteor",
                 "party"];
    for (var i = 0; i < words.length; i++) {
      console.log(words[i]);
      Magnets.insert({name: words[i], top: Math.floor(Random.fraction()*100)*5, left: Math.floor(Random.fraction()*100)*5});
    }
  } else {
    var magnets = Magnets.find({}); 
    debugger
  }
});