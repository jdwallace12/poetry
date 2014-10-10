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
  if (Magnets.find().count() < 3) {
    var words = ["hey", "time", "let's",
                 "love", "can", "awesome", "has", "not", "is", "a", "hubby", "in", "a", "is", "the", "us", "forever", "has", "had", "have", "s", "s", "ed", "the", "the", "was", "there", "their", "bunt", "a", "the", "as", "many", "much",
                 "poetry", "random", "best", "bidet", "Paulie D", "belly", "chubby", "moist", "wierdo", "dancing", "top shelf", "Mel Gibson", "Kati", "Hi", "love", "likes", "eating", "eats", "vomit", "I", "it", "funky", "grandma", "chicken", "got", "comeuppance", 
                 "beer", "farts", "shark", "is", "are", "we", "you", "i", "they", "ing", "crack pipe", "shart", "wine", "and", "a", "as", "uncle", "malfunction", "wardrobe","spray", "ed", "gas", "underwear", "no", "naked", "pwomp", "blerg", "!", "?", 
                 "Ralphie", "kitties", "very", "chunky", "so", "monkey", "smelly", "festive", "cheese", "juice", "turd", "star", "s", "dance", "snort", "Jesus", "Jersey", "poop", "Carlton", "Wallace",
                 "party", "sugar", "bear", "honey", "muffin", "can", "butt", "ass", "y", "the", "a", "an", "it", "stinks", "sucks", "fat", "one", "in", "at", "and", "as", "he", "she", "on", "Chipotle", "burrito", "mucous", "dingleberries"];
    for (var i = 0; i < words.length; i++) {
      console.log(words[i]);
      Magnets.insert({name: words[i], top: Math.floor(Random.fraction()*100)*6, left: Math.floor(Random.fraction()*100)*12});
    }
  } else {
    var magnets = Magnets.find({}).fetch();
    // _.each(magnets, function(a) { console.log(a); });
  }
});
