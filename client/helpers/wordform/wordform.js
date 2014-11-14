// Handle wordForm events
Template.wordForm.events = {
    'submit': function(e, tmpl) {
        // Don't postback
        e.preventDefault();
         
        Magnets.insert({
            name: tmpl.find("#name_of_word").value,
            top: Math.floor(Random.fraction() * 100) * 7,
            left: Math.floor(Random.fraction() * 100) * 8
        });

        var slap = $('#slap')[0]
        slap.play();
        $("#name_of_word").val("");
        $('.magnet:last-of-type').effect('highlight', {color: "#f1c40f;"}, 1300);

    }

};
