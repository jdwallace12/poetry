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
                        top: 800,
                        left: 126,               
                    });

                 Magnets.insert({
                        name: "deploy",
                        top: 800,
                        left: 180,               
                    });

                    Magnets.insert({
                        name: "minor",
                        top: 800,
                        left: 238,               
                    });
                    
                    Magnets.insert({
                        name: "down",
                        top: 800,
                        left: 289,               
                    });

                    Magnets.insert({
                        name: "build",
                        top: 800,
                        left: 338,               
                    });

                     Magnets.insert({
                        name: "disk",
                        top: 800,
                        left: 380,               
                    });

                    Magnets.insert({
                        name: "read",
                        top: 800,
                        left: 419,               
                    });

                    Magnets.insert({
                        name: "stack",
                        top: 552,
                        left: 389,               
                    });

                    Magnets.insert({
                        name: "Google",
                        top: 521,
                        left: 332,               
                    });


                    Magnets.insert({
                        name: "tl;dr",
                        top: 521,
                        left: 295,               
                    });


                    Magnets.insert({
                        name: "is",
                        top: 521,
                        left: 274,               
                    });


                    Magnets.insert({
                        name: "right",
                        top: 521,
                        left: 232,               
                    });

                    Magnets.insert({
                        name: "my",
                        top: 521,
                        left: 201,               
                    });

                    Magnets.insert({
                        name: "release",
                        top: 521,
                        left: 140,               
                    });


                    Magnets.insert({
                        name: "!",
                        top: 521,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "are",
                        top: 645,
                        left: 389,               
                    });

                    Magnets.insert({
                        name: "of",
                        top: 521,
                        left: 393,               
                    });

                    Magnets.insert({
                        name: "I",
                        top: 614,
                        left: 410,               
                    });

                    Magnets.insert({
                        name: "have",
                        top: 552,
                        left: 345,               
                    });

                    Magnets.insert({
                        name: "will",
                        top: 552,
                        left: 313,               
                    });

                    Magnets.insert({
                        name: "problem",
                        top: 552,
                        left: 244,               
                    });

                    Magnets.insert({
                        name: "memory",
                        top: 552,
                        left: 176,               
                    });

                    Magnets.insert({
                        name: "made",
                        top: 552,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "dev",
                        top: 583,
                        left: 379,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 583,
                        left: 355,               
                    });

                    Magnets.insert({
                        name: "kill",
                        top: 583,
                        left: 327,               
                    });

                    Magnets.insert({
                        name: "work",
                        top: 583,
                        left: 283,               
                    });

                    Magnets.insert({
                        name: "major",
                        top: 583,
                        left: 233,               
                    });

                    Magnets.insert({
                        name: "internet",
                        top: 583,
                        left: 170,               
                    });

                    Magnets.insert({
                        name: "write",
                        top: 583,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "engineer",
                        top: 614,
                        left: 339,               
                    });

                    Magnets.insert({
                        name: "we",
                        top: 614,
                        left: 309,               
                    });

                    Magnets.insert({
                        name: "bees",
                        top: 614,
                        left: 265,               
                    });

                    Magnets.insert({
                        name: "your",
                        top: 614,
                        left: 224,               
                    });

                    Magnets.insert({
                        name: "brogrammer",
                        top: 614,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "crash",
                        top: 645,
                        left: 340,               
                    });

                    Magnets.insert({
                        name: "angry",
                        top: 645,
                        left: 290,               
                    });

                    Magnets.insert({
                        name: "docs",
                        top: 645,
                        left: 245,               
                    });

                    Magnets.insert({
                        name: "call",
                        top: 645,
                        left: 211,               
                    });

                    Magnets.insert({
                        name: "fix",
                        top: 645,
                        left: 185,               
                    });

                    Magnets.insert({
                        name: "broken",
                        top: 645,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "how",
                        top: 676,
                        left: 381,               
                    });

                    Magnets.insert({
                        name: "issue",
                        top: 676,
                        left: 334,               
                    });

                    Magnets.insert({
                        name: "fire",
                        top: 676,
                        left: 302,               
                    });
                    
                    Magnets.insert({
                        name: "up",
                        top: 676,
                        left: 274,               
                    });

                    Magnets.insert({
                        name: "agile",
                        top: 676,
                        left: 231,               
                    });

                    Magnets.insert({
                        name: "code",
                        top: 676,
                        left: 186,               
                    });

                    Magnets.insert({
                        name: "no",
                        top: 676,
                        left: 158,               
                    });

                    Magnets.insert({
                        name: "did",
                        top: 676,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "io",
                        top: 707,
                        left: 391,               
                    });

                    Magnets.insert({
                        name: "oh",
                        top: 707,
                        left: 363,               
                    });

                    Magnets.insert({
                        name: "production",
                        top: 707,
                        left: 276,               
                    });

                    Magnets.insert({
                        name: "bug",
                        top: 707,
                        left: 239,               
                    });

                    Magnets.insert({
                        name: "all",
                        top: 707,
                        left: 214,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 707,
                        left: 190,               
                    });

                    Magnets.insert({
                        name: "s",
                        top: 707,
                        left: 172,               
                    });

                    Magnets.insert({
                        name: "?",
                        top: 707,
                        left: 154,               
                    });

                    Magnets.insert({
                        name: "on",
                        top: 707,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "staging",
                        top: 738,
                        left: 357,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 738,
                        left: 325,               
                    });

                    Magnets.insert({
                        name: "error",
                        top: 738,
                        left: 282,               
                    });

                    Magnets.insert({
                        name: ":",
                        top: 738,
                        left: 268,               
                    });

                    Magnets.insert({
                        name: "or",
                        top: 738,
                        left: 244,               
                    });

                    Magnets.insert({
                        name: "their",
                        top: 738,
                        left: 203,               
                    });

                    Magnets.insert({
                        name: "site",
                        top: 738,
                        left: 168,               
                    });

                    Magnets.insert({
                        name: "beer",
                        top: 738,
                        left: 126,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 769,
                        left: 400,               
                    });

                    Magnets.insert({
                        name: "and",
                        top: 769,
                        left: 364,               
                    });

                    Magnets.insert({
                        name: "full",
                        top: 769,
                        left: 334,               
                    });

                    Magnets.insert({
                        name: "our",
                        top: 769,
                        left: 301,               
                    });

                    Magnets.insert({
                        name: "ops",
                        top: 769,
                        left: 265,               
                    });

                    Magnets.insert({
                        name: "(ﾉಥ益ಥ）ﾉ﻿ ┻━┻",
                        top: 769,
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
