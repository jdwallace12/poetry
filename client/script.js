$(document).ready(function() {

    $(".chat-wrap").draggable();

    $('.chat-open').on('click', function() {    
        var drum = $('#drum')[0]
                    drum.play();     
        $('.chat-wrap').show();

    });



    // closes modal when escape key is pressed
    // var KEYCODE_ESC = 27;
    // $(document).keyup(function(e) {
    //     if (e.keyCode == KEYCODE_ESC) {
    //         $('#close_chat').click();
    //     }
    // });


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

    // var KEYCODE_ENTER = 13;
    // $(document).keyup(function(e) {
    //     if (e.keyCode == KEYCODE_ENTER) {
    //         $('#send').click();
    //      return false;
    //     }
    // });


    $(document).mouseup(function(e) {
        var container = $(".chat-wrap");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
 
        }
    });
});
