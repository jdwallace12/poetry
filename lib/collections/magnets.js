Magnets = new Meteor.Collection('magnets');


Magnets.allow({
    insert: function() {
        return true;
    },

    update: function() {
        return true;
    }

});


if (Meteor.isClient) {
    Meteor.subscribe('magnets', function() {
        return Magnets.find();
    });


    UI.body.events({
        'click #delete': function(e) {
            e.preventDefault();
            Meteor.call('removeAllMagnets');

        }

    });

}


if (Meteor.isServer) {

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    Meteor.publish('magnets', function() {
        return Magnets.find();
    });


    Meteor.startup(function() {

        return Meteor.methods({

            removeAllMagnets: function() {
                Magnets.remove({});

                var words = ["things", "deploy", "minor", "down", "build", "disk", "read", "stack", "Google", "tl;dr", "is", "right", "my", "release", "!", "are", "of", "I", "have", "will", "problem", "memory", "made", "dev", "to", "kill", "work", "major", "internet", "write", "engineer", "we", "bees", "your", "brogrammer", "crash", "angry", "docs", "call", "fix", "broken", "how", "issue", "fire", "up", "agile", "code", "no", "did", "io", "oh", "production", "bug", "all", "to", "s", "?", "on", "staging", "the", "error", ":", "or", "their", "site", "beer", "a", "and", "full", "our", "ops"];
                for (var i = 0; i < words.length; i++) {

                    Magnets.insert({
                        name: words[i],
                        top: Math.floor(Random.fraction() * 100) * 8,
                        left: Math.floor(Random.fraction() * 100) * 3
                    });
                }

            }

        });

    });

}
