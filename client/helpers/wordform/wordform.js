// Handle wordForm events
Template.wordForm.events = {
    'submit': function(e, tmpl) {
        // Don't postback
        e.preventDefault();
        // add the word to the db  
    $('.magnet').profanityFilter({
    customSwears: ['shit', 'fuck'],
    replaceWith: ['fiddle', 'fun', 'stupendous']
});   
        Magnets.insert({
            name: tmpl.find("#name_of_word").value,
            top: Math.floor(Random.fraction() * 100) * 7,
            left: Math.floor(Random.fraction() * 100) * 8           
        });


         $('.magnet:last-child').effect('highlight', {color: "#f1c40f;"}, 1300);
           var slap = $('#slap')[0]
                    slap.play();
        $("#name_of_word").val("");
    }

};
