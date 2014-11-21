$(document).ready(function() {


    $('#send').keydown(function(e) {
        if (e.keyCode == 13) e.preventDefault();
    });

    $('#send').keyup(function(e) {
        e.preventDefault();
        var $textbox = $(this);
        if ($textbox.val().length > 0 && e.keyCode == 13) {
            $('#send').click();
        }
    });


});
