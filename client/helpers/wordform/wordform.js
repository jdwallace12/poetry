// Handle wordForm events
Template.wordForm.events = {
    'submit': function(e, tmpl) {
        // Don't postback
        e.preventDefault();
        // add the word to the db  
        Magnets.insert({
            name: tmpl.find("#name_of_word").value,
            top: Math.floor(Random.fraction() * 100) * 7,
            left: Math.floor(Random.fraction() * 100) * 8           
        });
     //filter out dirty words here   
    $('.magnet').profanityFilter({
    customSwears: ['shit', 'fuck', 'ass', 'cunt', 'niggers'],
    replaceWith: ['fiddle', 'fun', 'stupendous', 'puppies', 'happy']

    });   

         $('.magnet:last-child').effect('highlight', {color: "#f1c40f;"}, 1300);
           var slap = $('#slap')[0]
                    slap.play();
        $("#name_of_word").val("");
    }

};
