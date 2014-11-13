Magnets = new Meteor.Collection('magnets');
//Applications.insert({name:"yahoo app", votes:0});
//Application.find().fetch()
//Application.update('id', {$inc: {votes}});

Fridge = new Meteor.Collection('fridge');


Fridge.allow({
    insert: function() {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });

Magnets.allow({
insert: function () {
    return true;
},

update: function() {
    return true;    
}

});


if (Meteor.isClient) {
    Meteor.subscribe('magnets', function(){
        
    //filter out dirty words here   
    $('.magnet').profanityFilter({
    customSwears: ["anal", "anilingus", "anus", "ass", "asses", "assfucker", "ass-fucker", "assfukka", "asshole", "asshole", "assholes", "assmucus", "assmunch", "asswhole", "autoerotic", "b00bs", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bestial", "bestiality", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blowjob", "blowjobs", "blumpkin", "boner", "boob", "boobs", "booobs", "boooobs", "breasts", "busty", "butt", "butthole", "buttmuch", "buttplug", "carpetmuncher", "chink", "choade", "clit", "clitoris", "clits", "clitty", "clusterfuck", "cock", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cock-sucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "creampie", "cum", "cumdumpster", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntbag", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cuntsicle", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "dick", "dickhead", "dildo", "dildos", "dog-fucker", "doggie style", "doggiestyle", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "erotic", "facial", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fucktoy", "fudgepacker", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "god", "god-dam", "goddamn", "goddamned", "god-damned", "hardcoresex", "hell", "homo", "homoerotic", "horniest", "horny", "hotsex", "jackoff", "jack-off", "jerk", "jerk-off", "jiz", "jizm", "jizz", "kinky", "knobjocky", "knobjokey", "kum", "kums", "labia", "masterbate", "masterbation", "masterbations", "masturbate", "mofo", "mo-fo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "queaf", "queer", "retard", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "shemale", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smut", "snatch", "teets", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "twat", "twathead", "twatty", "vagina", "viagra", "vulva", "wang", "wank", "wanker", "wanky", "whoar", "whore"],
    replaceWith: ['fiddle', 'fun', 'stupendous', 'puppies', 'happy', 'kittens', 'silly', 'coffee', 'IE', 'dancing', 'a', 'the', 'at', 'was', 'there', 'tired', 'sleepy', 'hungry', 'full', 'editor', 'pancakes', 'butter', 'syrup', 'source', 'open', 'clouds', 'sunshine', 'rainbows', 'unicorns', 'love', 'kind', 'censor', 'fragrant']
    });   
            
    return Magnets.find();
});


    UI.body.events({
        'click #delete': function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete everything?')) {
                Meteor.call('removeAllMagnets');
            }
        }
    });
}


if (Meteor.isServer) {

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    Meteor.publish('magnets', function(){
    return Magnets.find();
});


    Meteor.startup(function() {

        return Meteor.methods({

            removeAllMagnets: function() {

                return Magnets.remove({});

            }

        });

    });

}
