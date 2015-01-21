Fridge = new Meteor.Collection('fridge');


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
    Meteor.subscribe('usermagnets');

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

        Meteor.publish('usermagnets', function() {
        return Magnets.find({});
    });


    Meteor.publish('magnets', function() {
        return Magnets.find();
    });


    Meteor.startup(function() {

        return Meteor.methods({

        
            removeAllMagnets: function() {
                Magnets.remove({});
            },
        
            devopsMagnets: function() {
                Magnets.remove({});
                 Magnets.insert({
                        name: "things",
                        top: 400,
                        left: 1226,  
                    });

                 Magnets.insert({
                        name: "deploy",
                        top: 400,
                        left: 1280,               
                    });

                    Magnets.insert({
                        name: "minor",
                        top: 400,
                        left: 1338,               
                    });
                    
                    Magnets.insert({
                        name: "down",
                        top: 400,
                        left: 1389,               
                    });

                    Magnets.insert({
                        name: "build",
                        top: 400,
                        left: 1438,               
                    });

                     Magnets.insert({
                        name: "disk",
                        top: 400,
                        left: 1480,               
                    });

                    Magnets.insert({
                        name: "read",
                        top: 369,
                        left: 1316,               
                    });

                    Magnets.insert({
                        name: "stack",
                        top: 152,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "Google",
                        top: 121,
                        left: 1432,               
                    });


                    Magnets.insert({
                        name: "tl;dr",
                        top: 121,
                        left: 1395,               
                    });


                    Magnets.insert({
                        name: "is",
                        top: 121,
                        left: 1374,               
                    });


                    Magnets.insert({
                        name: "right",
                        top: 121,
                        left: 1332,               
                    });

                    Magnets.insert({
                        name: "my",
                        top: 121,
                        left: 1301,               
                    });

                    Magnets.insert({
                        name: "release",
                        top: 121,
                        left: 1240,               
                    });


                    Magnets.insert({
                        name: "!",
                        top: 121,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "are",
                        top: 245,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "of",
                        top: 121,
                        left: 1493,               
                    });

                    Magnets.insert({
                        name: "I",
                        top: 214,
                        left: 1510,               
                    });

                    Magnets.insert({
                        name: "have",
                        top: 152,
                        left: 1445,               
                    });

                    Magnets.insert({
                        name: "will",
                        top: 152,
                        left: 1413,               
                    });

                    Magnets.insert({
                        name: "problem",
                        top: 152,
                        left: 1344,               
                    });

                    Magnets.insert({
                        name: "memory",
                        top: 152,
                        left: 1276,               
                    });

                    Magnets.insert({
                        name: "made",
                        top: 152,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "dev",
                        top: 183,
                        left: 1479,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 183,
                        left: 1455,               
                    });

                    Magnets.insert({
                        name: "kill",
                        top: 183,
                        left: 1427,               
                    });

                    Magnets.insert({
                        name: "work",
                        top: 183,
                        left: 1383,               
                    });

                    Magnets.insert({
                        name: "major",
                        top: 183,
                        left: 1333,               
                    });

                    Magnets.insert({
                        name: "internet",
                        top: 183,
                        left: 1270,               
                    });

                    Magnets.insert({
                        name: "write",
                        top: 183,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "engineer",
                        top: 214,
                        left: 1439,               
                    });

                    Magnets.insert({
                        name: "we",
                        top: 214,
                        left: 1409,               
                    });

                    Magnets.insert({
                        name: "bees",
                        top: 214,
                        left: 1365,               
                    });

                    Magnets.insert({
                        name: "your",
                        top: 214,
                        left: 1324,               
                    });

                    Magnets.insert({
                        name: "brogrammer",
                        top: 214,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "crash",
                        top: 245,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "angry",
                        top: 245,
                        left: 1390,               
                    });

                    Magnets.insert({
                        name: "docs",
                        top: 245,
                        left: 1345,               
                    });

                    Magnets.insert({
                        name: "call",
                        top: 245,
                        left:1311,               
                    });

                    Magnets.insert({
                        name: "fix",
                        top: 245,
                        left: 1285,               
                    });

                    Magnets.insert({
                        name: "broken",
                        top: 245,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "how",
                        top: 276,
                        left: 1481,               
                    });

                    Magnets.insert({
                        name: "issue",
                        top: 276,
                        left: 1434,               
                    });

                    Magnets.insert({
                        name: "fire",
                        top: 276,
                        left: 1402,               
                    });
                    
                    Magnets.insert({
                        name: "up",
                        top: 276,
                        left: 1374,               
                    });

                    Magnets.insert({
                        name: "agile",
                        top: 276,
                        left: 1331,               
                    });

                    Magnets.insert({
                        name: "code",
                        top: 276,
                        left: 1286,               
                    });

                    Magnets.insert({
                        name: "no",
                        top: 276,
                        left: 1258,               
                    });

                    Magnets.insert({
                        name: "did",
                        top: 276,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "io",
                        top: 307,
                        left: 1491,               
                    });

                    Magnets.insert({
                        name: "oh",
                        top: 307,
                        left: 1463,               
                    });

                    Magnets.insert({
                        name: "production",
                        top: 307,
                        left: 1376,               
                    });

                    Magnets.insert({
                        name: "bug",
                        top: 307,
                        left: 1339,               
                    });

                    Magnets.insert({
                        name: "all",
                        top: 307,
                        left: 1314,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 307,
                        left: 1290,               
                    });

                    Magnets.insert({
                        name: "s",
                        top: 307,
                        left: 1272,               
                    });

                    Magnets.insert({
                        name: "?",
                        top: 307,
                        left: 1254,               
                    });

                    Magnets.insert({
                        name: "on",
                        top: 307,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "staging",
                        top: 338,
                        left: 1457,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 338,
                        left: 1425,               
                    });

                    Magnets.insert({
                        name: "error",
                        top: 338,
                        left: 1382,               
                    });

                    Magnets.insert({
                        name: ":",
                        top: 338,
                        left: 1368,               
                    });

                    Magnets.insert({
                        name: "or",
                        top: 338,
                        left: 1344,               
                    });

                    Magnets.insert({
                        name: "their",
                        top: 338,
                        left: 1303,               
                    });

                    Magnets.insert({
                        name: "site",
                        top: 338,
                        left: 1268,               
                    });

                    Magnets.insert({
                        name: "beer",
                        top: 338,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 369,
                        left: 1498,               
                    });

                    Magnets.insert({
                        name: "and",
                        top: 369,
                        left: 1461,               
                    });

                    Magnets.insert({
                        name: "full",
                        top: 369,
                        left: 1430,               
                    });

                    Magnets.insert({
                        name: "our",
                        top: 369,
                        left: 1396,               
                    });

                    Magnets.insert({
                        name: "ops",
                        top: 369,
                        left: 1359,               
                    });

                    Magnets.insert({
                        name: "continuous",
                        top: 369,
                        left: 1226,               
                    });

            },
             

            developerMagnets: function() {
                Magnets.remove({});

                 Magnets.insert({
                        name: "service",
                        top: 464,
                        left: 1226,               
                    });

                 Magnets.insert({
                        name: "mobile",
                        top: 464,
                        left: 1287,               
                    });

                    Magnets.insert({
                        name: "system",
                        top: 464,
                        left: 1346,               
                    });
                    
                    Magnets.insert({
                        name: "monitor",
                        top: 464,
                        left: 1408,               
                    });

                    Magnets.insert({
                        name: "unicorn",
                        top: 464,
                        left: 1473,               
                    });

                     Magnets.insert({
                        name: "latency",
                        top: 464,
                        left: 1537,               
                    });

                    Magnets.insert({
                        name: "app",
                        top: 464,
                        left: 1599,               
                    });

                    Magnets.insert({
                        name: "open",
                        top: 495,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "micro",
                        top: 495,
                        left: 1273,               
                    });


                    Magnets.insert({
                        name: "responsive",
                        top: 495,
                        left: 1324,               
                    });


                    Magnets.insert({
                        name: "awesome",
                        top: 495,
                        left: 1409,               
                    });


                    Magnets.insert({
                        name: "miss",
                        top: 495,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "do",
                        top: 495,
                        left: 1533,               
                    });

                    Magnets.insert({
                        name: "social",
                        top: 495,
                        left: 1563,               
                    });

                    Magnets.insert({
                        name: "big",
                        top: 526,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "enterprise",
                        top: 526,
                        left: 1259,               
                    });

                    Magnets.insert({
                        name: "it",
                        top: 495,
                        left: 1615,               
                    });

                    Magnets.insert({
                        name: "low",
                        top: 526,
                        left: 1341,               
                    });

                    Magnets.insert({
                        name: "I'm",
                        top: 526,
                        left: 1377,               
                    });

                    Magnets.insert({
                        name: "so",
                        top: 526,
                        left: 1409,               
                    });

                    Magnets.insert({
                        name: "ironic",
                        top: 526,
                        left: 1437,               
                    });

                    Magnets.insert({
                        name: "web",
                        top: 526,
                        left: 1487,               
                    });

                    Magnets.insert({
                        name: "framework",
                        top: 526,
                        left: 1528,               
                    });

                    Magnets.insert({
                        name: "availability",
                        top: 557,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "boring",
                        top: 557,
                        left: 1311,               
                    });

                    Magnets.insert({
                        name: "over",
                        top: 557,
                        left: 1368,               
                    });

                    Magnets.insert({
                        name: "for",
                        top: 557,
                        left: 1410,               
                    });

                    Magnets.insert({
                        name: "not",
                        top: 557,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "critical",
                        top: 557,
                        left: 1474,               
                    });

                    Magnets.insert({
                        name: "network",
                        top: 557,
                        left: 1532,               
                    });

                    Magnets.insert({
                        name: "everything",
                        top: 588,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "always",
                        top: 588,
                        left: 1311,               
                    });

                    Magnets.insert({
                        name: "distributed",
                        top: 588,
                        left: 1371,               
                    });

                    Magnets.insert({
                        name: "beta",
                        top: 557,
                        left: 1600,               
                    });

                    Magnets.insert({
                        name: "ready",
                        top: 588,
                        left: 1458,               
                    });

                    Magnets.insert({
                        name: "cloud",
                        top: 588,
                        left: 1509,               
                    });

                    Magnets.insert({
                        name: "performance",
                        top: 619,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "backend",
                        top: 588,
                        left: 1560,               
                    });

                    Magnets.insert({
                        name: "oriented",
                        top: 619,
                        left:1328,               
                    });

                    Magnets.insert({
                        name: "like",
                        top: 619,
                        left: 1398,               
                    });

                    Magnets.insert({
                        name: "time",
                        top: 619,
                        left: 1433,               
                    });

                    Magnets.insert({
                        name: "you",
                        top: 619,
                        left: 1475,               
                    });

                    Magnets.insert({
                        name: "frontend",
                        top: 619,
                        left: 1512,               
                    });

                    Magnets.insert({
                        name: "don't",
                        top: 619,
                        left: 1583,               
                    });
                    
                    Magnets.insert({
                        name: "launch",
                        top: 650,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 650,
                        left: 1284,               
                    });

                    Magnets.insert({
                        name: "with",
                        top: 650,
                        left: 1318,               
                    });

                    Magnets.insert({
                        name: "which",
                        top: 650,
                        left: 1359,               
                    });

                    Magnets.insert({
                        name: "need",
                        top: 650,
                        left: 1412,               
                    });

                    Magnets.insert({
                        name: "but",
                        top: 650,
                        left: 1459,               
                    });

                    Magnets.insert({
                        name: "hack",
                        top: 650,
                        left: 1493,               
                    });

                    Magnets.insert({
                        name: "log",
                        top: 650,
                        left: 1538,               
                    });

                    Magnets.insert({
                        name: "yet",
                        top: 650,
                        left: 1571,               
                    });

                    Magnets.insert({
                        name: "architecture",
                        top: 681,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "high",
                        top: 681,
                        left: 1322,               
                    });

                    Magnets.insert({
                        name: "still",
                        top: 681,
                        left: 1364,               
                    });

                    Magnets.insert({
                        name: "only",
                        top: 681,
                        left: 1399,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 681,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "hit",
                        top: 681,
                        left: 1460,               
                    });

                    Magnets.insert({
                        name: "get",
                        top: 526,
                        left: 1615,               
                    });

                    Magnets.insert({
                        name: "scalability",
                        top: 681,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "out",
                        top: 681,
                        left: 1571,               
                    });

                    Magnets.insert({
                        name: "database",
                        top: 712,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "in",
                        top: 650,
                        left: 1604,               
                    });

                    Magnets.insert({
                        name: "run",
                        top: 681,
                        left: 1605,               
                    });

                    Magnets.insert({
                        name: "cache",
                        top: 712,
                        left: 1303,               
                    });

                    Magnets.insert({
                        name: "think",
                        top: 712,
                        left: 1357,               
                    });

                    Magnets.insert({
                        name: "what",
                        top: 712,
                        left: 1403,               
                    });

                    Magnets.insert({
                        name: ",",
                        top: 712,
                        left: 1449,               
                    });

                    Magnets.insert({
                        name: "data",
                        top: 712,
                        left: 1464,               
                    });

                    Magnets.insert({
                        name: "free",
                        top: 712,
                        left: 1507,               
                    });

                    Magnets.insert({
                        name: "from",
                        top: 712,
                        left: 1545,               
                    });

                    Magnets.insert({
                        name: "host",
                        top: 712,
                        left: 1589,               
                    });

            },
             
            allMagnets: function() {
                Magnets.remove({});

            Magnets.insert({
                        name: "service",
                        top: 464,
                        left: 1226,               
                    });

                 Magnets.insert({
                        name: "mobile",
                        top: 464,
                        left: 1287,               
                    });

                    Magnets.insert({
                        name: "system",
                        top: 464,
                        left: 1346,               
                    });
                    
                    Magnets.insert({
                        name: "monitor",
                        top: 464,
                        left: 1408,               
                    });

                    Magnets.insert({
                        name: "unicorn",
                        top: 464,
                        left: 1473,               
                    });

                     Magnets.insert({
                        name: "latency",
                        top: 464,
                        left: 1537,               
                    });

                    Magnets.insert({
                        name: "app",
                        top: 464,
                        left: 1599,               
                    });

                    Magnets.insert({
                        name: "open",
                        top: 495,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "micro",
                        top: 495,
                        left: 1273,               
                    });


                    Magnets.insert({
                        name: "responsive",
                        top: 495,
                        left: 1324,               
                    });


                    Magnets.insert({
                        name: "awesome",
                        top: 495,
                        left: 1409,               
                    });


                    Magnets.insert({
                        name: "miss",
                        top: 495,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "do",
                        top: 495,
                        left: 1533,               
                    });

                    Magnets.insert({
                        name: "social",
                        top: 495,
                        left: 1563,               
                    });

                    Magnets.insert({
                        name: "big",
                        top: 526,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "enterprise",
                        top: 526,
                        left: 1259,               
                    });

                    Magnets.insert({
                        name: "it",
                        top: 495,
                        left: 1615,               
                    });

                    Magnets.insert({
                        name: "low",
                        top: 526,
                        left: 1341,               
                    });

                    Magnets.insert({
                        name: "I'm",
                        top: 526,
                        left: 1377,               
                    });

                    Magnets.insert({
                        name: "so",
                        top: 526,
                        left: 1409,               
                    });

                    Magnets.insert({
                        name: "ironic",
                        top: 526,
                        left: 1437,               
                    });

                    Magnets.insert({
                        name: "web",
                        top: 526,
                        left: 1487,               
                    });

                    Magnets.insert({
                        name: "framework",
                        top: 526,
                        left: 1528,               
                    });

                    Magnets.insert({
                        name: "availability",
                        top: 557,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "boring",
                        top: 557,
                        left: 1311,               
                    });

                    Magnets.insert({
                        name: "over",
                        top: 557,
                        left: 1368,               
                    });

                    Magnets.insert({
                        name: "for",
                        top: 557,
                        left: 1410,               
                    });

                    Magnets.insert({
                        name: "not",
                        top: 557,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "critical",
                        top: 557,
                        left: 1474,               
                    });

                    Magnets.insert({
                        name: "network",
                        top: 557,
                        left: 1532,               
                    });

                    Magnets.insert({
                        name: "everything",
                        top: 588,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "always",
                        top: 588,
                        left: 1311,               
                    });

                    Magnets.insert({
                        name: "distributed",
                        top: 588,
                        left: 1371,               
                    });

                    Magnets.insert({
                        name: "beta",
                        top: 557,
                        left: 1600,               
                    });

                    Magnets.insert({
                        name: "ready",
                        top: 588,
                        left: 1458,               
                    });

                    Magnets.insert({
                        name: "cloud",
                        top: 588,
                        left: 1509,               
                    });

                    Magnets.insert({
                        name: "performance",
                        top: 619,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "backend",
                        top: 588,
                        left: 1560,               
                    });

                    Magnets.insert({
                        name: "oriented",
                        top: 619,
                        left:1328,               
                    });

                    Magnets.insert({
                        name: "like",
                        top: 619,
                        left: 1398,               
                    });

                    Magnets.insert({
                        name: "time",
                        top: 619,
                        left: 1433,               
                    });

                    Magnets.insert({
                        name: "you",
                        top: 619,
                        left: 1475,               
                    });

                    Magnets.insert({
                        name: "frontend",
                        top: 619,
                        left: 1512,               
                    });

                    Magnets.insert({
                        name: "don't",
                        top: 619,
                        left: 1583,               
                    });
                    
                    Magnets.insert({
                        name: "launch",
                        top: 650,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 650,
                        left: 1284,               
                    });

                    Magnets.insert({
                        name: "with",
                        top: 650,
                        left: 1318,               
                    });

                    Magnets.insert({
                        name: "which",
                        top: 650,
                        left: 1359,               
                    });

                    Magnets.insert({
                        name: "need",
                        top: 650,
                        left: 1412,               
                    });

                    Magnets.insert({
                        name: "but",
                        top: 650,
                        left: 1459,               
                    });

                    Magnets.insert({
                        name: "hack",
                        top: 650,
                        left: 1493,               
                    });

                    Magnets.insert({
                        name: "log",
                        top: 650,
                        left: 1538,               
                    });

                    Magnets.insert({
                        name: "yet",
                        top: 650,
                        left: 1571,               
                    });

                    Magnets.insert({
                        name: "architecture",
                        top: 681,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "high",
                        top: 681,
                        left: 1322,               
                    });

                    Magnets.insert({
                        name: "still",
                        top: 681,
                        left: 1364,               
                    });

                    Magnets.insert({
                        name: "only",
                        top: 681,
                        left: 1399,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 681,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "hit",
                        top: 681,
                        left: 1460,               
                    });

                    Magnets.insert({
                        name: "get",
                        top: 526,
                        left: 1615,               
                    });

                    Magnets.insert({
                        name: "scalability",
                        top: 681,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "out",
                        top: 681,
                        left: 1571,               
                    });

                    Magnets.insert({
                        name: "database",
                        top: 712,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "in",
                        top: 650,
                        left: 1604,               
                    });

                    Magnets.insert({
                        name: "run",
                        top: 681,
                        left: 1605,               
                    });

                    Magnets.insert({
                        name: "cache",
                        top: 712,
                        left: 1303,               
                    });

                    Magnets.insert({
                        name: "think",
                        top: 712,
                        left: 1357,               
                    });

                    Magnets.insert({
                        name: "what",
                        top: 712,
                        left: 1403,               
                    });

                    Magnets.insert({
                        name: ",",
                        top: 712,
                        left: 1449,               
                    });

                    Magnets.insert({
                        name: "data",
                        top: 712,
                        left: 1464,               
                    });

                    Magnets.insert({
                        name: "free",
                        top: 712,
                        left: 1507,               
                    });

                    Magnets.insert({
                        name: "from",
                        top: 712,
                        left: 1545,               
                    });

                    Magnets.insert({
                        name: "host",
                        top: 712,
                        left: 1589,               
                    });

                     Magnets.insert({
                        name: "things",
                        top: 400,
                        left: 1226,               
                    });

                 Magnets.insert({
                        name: "deploy",
                        top: 400,
                        left: 1280,               
                    });

                    Magnets.insert({
                        name: "minor",
                        top: 400,
                        left: 1338,               
                    });
                    
                    Magnets.insert({
                        name: "down",
                        top: 400,
                        left: 1389,               
                    });

                    Magnets.insert({
                        name: "build",
                        top: 400,
                        left: 1438,               
                    });

                     Magnets.insert({
                        name: "disk",
                        top: 400,
                        left: 1480,               
                    });

                    Magnets.insert({
                        name: "read",
                        top: 369,
                        left: 1316,               
                    });

                    Magnets.insert({
                        name: "stack",
                        top: 152,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "Google",
                        top: 121,
                        left: 1432,               
                    });


                    Magnets.insert({
                        name: "tl;dr",
                        top: 121,
                        left: 1395,               
                    });


                    Magnets.insert({
                        name: "is",
                        top: 121,
                        left: 1374,               
                    });


                    Magnets.insert({
                        name: "right",
                        top: 121,
                        left: 1332,               
                    });

                    Magnets.insert({
                        name: "my",
                        top: 121,
                        left: 1301,               
                    });

                    Magnets.insert({
                        name: "release",
                        top: 121,
                        left: 1240,               
                    });


                    Magnets.insert({
                        name: "!",
                        top: 121,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "are",
                        top: 245,
                        left: 1489,               
                    });

                    Magnets.insert({
                        name: "of",
                        top: 121,
                        left: 1493,               
                    });

                    Magnets.insert({
                        name: "I",
                        top: 214,
                        left: 1510,               
                    });

                    Magnets.insert({
                        name: "have",
                        top: 152,
                        left: 1445,               
                    });

                    Magnets.insert({
                        name: "will",
                        top: 152,
                        left: 1413,               
                    });

                    Magnets.insert({
                        name: "problem",
                        top: 152,
                        left: 1344,               
                    });

                    Magnets.insert({
                        name: "memory",
                        top: 152,
                        left: 1276,               
                    });

                    Magnets.insert({
                        name: "made",
                        top: 152,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "dev",
                        top: 183,
                        left: 1479,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 183,
                        left: 1455,               
                    });

                    Magnets.insert({
                        name: "kill",
                        top: 183,
                        left: 1427,               
                    });

                    Magnets.insert({
                        name: "work",
                        top: 183,
                        left: 1383,               
                    });

                    Magnets.insert({
                        name: "major",
                        top: 183,
                        left: 1333,               
                    });

                    Magnets.insert({
                        name: "internet",
                        top: 183,
                        left: 1270,               
                    });

                    Magnets.insert({
                        name: "write",
                        top: 183,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "engineer",
                        top: 214,
                        left: 1439,               
                    });

                    Magnets.insert({
                        name: "we",
                        top: 214,
                        left: 1409,               
                    });

                    Magnets.insert({
                        name: "bees",
                        top: 214,
                        left: 1365,               
                    });

                    Magnets.insert({
                        name: "your",
                        top: 214,
                        left: 1324,               
                    });

                    Magnets.insert({
                        name: "brogrammer",
                        top: 214,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "crash",
                        top: 245,
                        left: 1440,               
                    });

                    Magnets.insert({
                        name: "angry",
                        top: 245,
                        left: 1390,               
                    });

                    Magnets.insert({
                        name: "docs",
                        top: 245,
                        left: 1345,               
                    });

                    Magnets.insert({
                        name: "call",
                        top: 245,
                        left:1311,               
                    });

                    Magnets.insert({
                        name: "fix",
                        top: 245,
                        left: 1285,               
                    });

                    Magnets.insert({
                        name: "broken",
                        top: 245,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "how",
                        top: 276,
                        left: 1481,               
                    });

                    Magnets.insert({
                        name: "issue",
                        top: 276,
                        left: 1434,               
                    });

                    Magnets.insert({
                        name: "fire",
                        top: 276,
                        left: 1402,               
                    });
                    
                    Magnets.insert({
                        name: "up",
                        top: 276,
                        left: 1374,               
                    });

                    Magnets.insert({
                        name: "agile",
                        top: 276,
                        left: 1331,               
                    });

                    Magnets.insert({
                        name: "code",
                        top: 276,
                        left: 1286,               
                    });

                    Magnets.insert({
                        name: "no",
                        top: 276,
                        left: 1258,               
                    });

                    Magnets.insert({
                        name: "did",
                        top: 276,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "io",
                        top: 307,
                        left: 1491,               
                    });

                    Magnets.insert({
                        name: "oh",
                        top: 307,
                        left: 1463,               
                    });

                    Magnets.insert({
                        name: "production",
                        top: 307,
                        left: 1376,               
                    });

                    Magnets.insert({
                        name: "bug",
                        top: 307,
                        left: 1339,               
                    });

                    Magnets.insert({
                        name: "all",
                        top: 307,
                        left: 1314,               
                    });

                    Magnets.insert({
                        name: "to",
                        top: 307,
                        left: 1290,               
                    });

                    Magnets.insert({
                        name: "s",
                        top: 307,
                        left: 1272,               
                    });

                    Magnets.insert({
                        name: "?",
                        top: 307,
                        left: 1254,               
                    });

                    Magnets.insert({
                        name: "on",
                        top: 307,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "staging",
                        top: 338,
                        left: 1457,               
                    });

                    Magnets.insert({
                        name: "the",
                        top: 338,
                        left: 1425,               
                    });

                    Magnets.insert({
                        name: "error",
                        top: 338,
                        left: 1382,               
                    });

                    Magnets.insert({
                        name: ":",
                        top: 338,
                        left: 1368,               
                    });

                    Magnets.insert({
                        name: "or",
                        top: 338,
                        left: 1344,               
                    });

                    Magnets.insert({
                        name: "their",
                        top: 338,
                        left: 1303,               
                    });

                    Magnets.insert({
                        name: "site",
                        top: 338,
                        left: 1268,               
                    });

                    Magnets.insert({
                        name: "beer",
                        top: 338,
                        left: 1226,               
                    });

                    Magnets.insert({
                        name: "a",
                        top: 369,
                        left: 1498,               
                    });

                    Magnets.insert({
                        name: "and",
                        top: 369,
                        left: 1461,               
                    });

                    Magnets.insert({
                        name: "full",
                        top: 369,
                        left: 1430,               
                    });

                    Magnets.insert({
                        name: "our",
                        top: 369,
                        left: 1396,               
                    });

                    Magnets.insert({
                        name: "ops",
                        top: 369,
                        left: 1359,               
                    });

                    Magnets.insert({
                        name: "continuous",
                        top: 369,
                        left: 1226,               
                    });

            }
             

        });

    });

}
