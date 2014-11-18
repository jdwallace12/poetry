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

                 Magnets.insert({
                        name: "things",
                        top: 400,
                        left: 126,               
                    });

                 Magnets.insert({
                        name: "deploy",
                        top: 400,
                        left: 180,               
                    });

                    Magnets.insert({
                        name: "minor",
                        top: 400,
                        left: 238,               
                    });
                    
                    Magnets.insert({
                        name: "down",
                        top: 400,
                        left: 289,               
                    });

                    Magnets.insert({
                        name: "build",
                        top: 400,
                        left: 338,               
                    });

                     Magnets.insert({
                        name: "disk",
                        top: 400,
                        left: 380,               
                    });

                    Magnets.insert({
                        name: "read",
                        top: 400,
                        left: 419,               
                    });

                    Magnets.insert({
                        name: "stack",
                        top: 152,
                        left: 389,               
                    });

                    Magnets.insert({
                        name: "Google",
                        top: 121,
                        left: 332,               
                    });


                    Magnets.insert({
                        name: "tl;dr",
                        top: 121,
                        left: 295,               
                    });


                    Magnets.insert({
                        name: "is",
                        top: 121,
                        left: 274,               
                    });


                    Magnets.insert({
                        name: "right",
                        top: 121,
                        left: 232,               
                    });

                    Magnets.insert({
                        name: "my",
                        top: 121,
                        left: 201,               
                    });

                    Magnets.insert({
                        name: "release",
                        top: 121,
                        left: 140,               
                    });


                    Magnets.insert({
                        name: "!",
                        top: 121,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "are",
                        top: 245,
                        left: 389,               
                    });

                    Magnets.insert({
                        name: "of",
                        top: 121,
                        left: 393,               
                    });

                    Magnets.insert({
                        name: "I",
                        top: 214,
                        left: 410,               
                    });

                    Magnets.insert({
                        name: "have",
                        top: 152,
                        left: 345,               
                    });

                    Magnets.insert({
                        name: "will",
                        top: 152,
                        left: 313,               
                    });

                    Magnets.insert({
                        name: "problem",
                        top: 152,
                        left: 244,               
                    });

                    Magnets.insert({
                        name: "memory",
                        top: 152,
                        left: 176,               
                    });

                    Magnets.insert({
                        name: "made",
                        top: 152,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "dev",
                        top: 183,
                        left: 379,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 183,
                        left: 355,               
                    });

                    Magnets.insert({
                        name: "kill",
                        top: 183,
                        left: 327,               
                    });

                    Magnets.insert({
                        name: "work",
                        top: 183,
                        left: 283,               
                    });

                    Magnets.insert({
                        name: "major",
                        top: 183,
                        left: 233,               
                    });

                    Magnets.insert({
                        name: "internet",
                        top: 183,
                        left: 170,               
                    });

                    Magnets.insert({
                        name: "write",
                        top: 183,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "engineer",
                        top: 214,
                        left: 339,               
                    });

                    Magnets.insert({
                        name: "we",
                        top: 214,
                        left: 309,               
                    });

                    Magnets.insert({
                        name: "bees",
                        top: 214,
                        left: 265,               
                    });

                    Magnets.insert({
                        name: "your",
                        top: 214,
                        left: 224,               
                    });

                    Magnets.insert({
                        name: "brogrammer",
                        top: 214,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "crash",
                        top: 245,
                        left: 340,               
                    });

                    Magnets.insert({
                        name: "angry",
                        top: 245,
                        left: 290,               
                    });

                    Magnets.insert({
                        name: "docs",
                        top: 245,
                        left: 245,               
                    });

                    Magnets.insert({
                        name: "call",
                        top: 245,
                        left: 211,               
                    });

                    Magnets.insert({
                        name: "fix",
                        top: 245,
                        left: 185,               
                    });

                    Magnets.insert({
                        name: "broken",
                        top: 245,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "how",
                        top: 276,
                        left: 381,               
                    });

                    Magnets.insert({
                        name: "issue",
                        top: 276,
                        left: 334,               
                    });

                    Magnets.insert({
                        name: "fire",
                        top: 276,
                        left: 302,               
                    });
                    
                    Magnets.insert({
                        name: "up",
                        top: 276,
                        left: 274,               
                    });

                    Magnets.insert({
                        name: "agile",
                        top: 276,
                        left: 231,               
                    });

                    Magnets.insert({
                        name: "code",
                        top: 276,
                        left: 186,               
                    });

                    Magnets.insert({
                        name: "no",
                        top: 276,
                        left: 158,               
                    });

                    Magnets.insert({
                        name: "did",
                        top: 276,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "io",
                        top: 307,
                        left: 391,               
                    });

                    Magnets.insert({
                        name: "oh",
                        top: 307,
                        left: 363,               
                    });

                    Magnets.insert({
                        name: "production",
                        top: 307,
                        left: 276,               
                    });

                    Magnets.insert({
                        name: "bug",
                        top: 307,
                        left: 239,               
                    });

                    Magnets.insert({
                        name: "all",
                        top: 307,
                        left: 214,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 307,
                        left: 190,               
                    });

                    Magnets.insert({
                        name: "s",
                        top: 307,
                        left: 172,               
                    });

                    Magnets.insert({
                        name: "?",
                        top: 307,
                        left: 154,               
                    });

                    Magnets.insert({
                        name: "on",
                        top: 307,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "staging",
                        top: 338,
                        left: 357,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 338,
                        left: 325,               
                    });

                    Magnets.insert({
                        name: "error",
                        top: 338,
                        left: 282,               
                    });

                    Magnets.insert({
                        name: ":",
                        top: 338,
                        left: 268,               
                    });

                    Magnets.insert({
                        name: "or",
                        top: 338,
                        left: 244,               
                    });

                    Magnets.insert({
                        name: "their",
                        top: 338,
                        left: 203,               
                    });

                    Magnets.insert({
                        name: "site",
                        top: 338,
                        left: 168,               
                    });

                    Magnets.insert({
                        name: "beer",
                        top: 338,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 369,
                        left: 400,               
                    });

                    Magnets.insert({
                        name: "and",
                        top: 369,
                        left: 364,               
                    });

                    Magnets.insert({
                        name: "full",
                        top: 369,
                        left: 334,               
                    });

                    Magnets.insert({
                        name: "our",
                        top: 369,
                        left: 301,               
                    });

                    Magnets.insert({
                        name: "ops",
                        top: 369,
                        left: 265,               
                    });

                    Magnets.insert({
                        name: "(ﾉಥ益ಥ）ﾉ﻿ ┻━┻",
                        top: 369,
                        left: 126,               
                    });



                // var words = ["things", "deploy", "minor", "down", "build", "disk", "read", "stack", "Google", "tl;dr", "is", "right", "my", "release", "!", "are", "of", "I", "have", "will", "problem", "memory", "made", "dev", "to", "kill", "work", "major", "internet", "write", "engineer", "we", "bees", "your", "brogrammer", "crash", "angry", "docs", "call", "fix", "broken", "how", "issue", "fire", "up", "agile", "code", "no", "did", "io", "oh", "production", "bug", "all", "to", "s", "?", "on", "staging", "the", "error", ":", "or", "their", "site", "beer", "a", "and", "full", "our", "ops", "‎(ﾉಥ益ಥ）ﾉ﻿ ┻━┻"];
                // for (var i = 0; i < words.length; i++) {

                //     Magnets.insert({
                //         name: words[i],
                //         top: Math.floor(Random.fraction() * 100) * 8,
                //         left: Math.floor(Random.fraction() * 100) * 3
                //     });
                // }

            }

        });

    });

}
