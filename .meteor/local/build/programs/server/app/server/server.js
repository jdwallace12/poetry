(function(){Meteor.methods({
    'vote': function(magnetId) {
        if (!Meteor.user())
            return;

        Magnets.update(magnetId, {
            $inc: {
                votes: 1
            },
            $addToSet: {
                voters: Meteor.user().services.faceboook.username
            }
        });
    },
    'set_position': function(magnetId, position) {
        console.log(position)
        Magnets.update(magnetId, {
            $set: {
                top: position.top,
                left: position.left
            }
        });
    },
    removeAllMessages: function() {
        return Messages.remove({});
    }

});

Meteor.startup(function() {

    if (Magnets.find().count() < 3) {
        var words = ["things", "deploy", "minor", "down", "build", "disk", "read", "stack", "Google", "tl;dr", "is", "right", "my", "release", "!", "are", "of", "I", "have", "will", "problem", "memory", "made", "dev", "to", "kill", "work", "major", "internet", "write", "engineer", "we", "bees", "your", "brogrammer", "crash", "angry", "docs", "call", "fix", "broken", "how", "issue", "fire", "up", "agile", "code", "no", "did", "io", "oh", "production", "bug", "all", "to", "s", "?", "on", "staging", "the", "error", ":", "or", "their", "site", "beer", "a", "and", "full", "our", "ops", "‎(ﾉಥ益ಥ）ﾉ﻿ ┻━┻"];
        for (var i = 0; i < words.length; i++) {
            console.log(words[i]);
            Magnets.insert({
                name: words[i],
                top: Math.floor(Random.fraction() * 100) * 8,
                left: Math.floor(Random.fraction() * 100) * 3
            });
        }
    } else {
        var magnets = Magnets.find({}).fetch();
    }
});

})();
