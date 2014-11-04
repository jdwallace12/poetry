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
         $('.magnet:last').effect('highlight', {color: "#f1c40f;"}, 2000);
        $("#name_of_word").val("");
    }
};
