$(document).ready(function() {
    $('.chat-wrap').hide();
    $('.chat-open').show();
    $('#close_chat').on('click', function() {
        $('.chat-wrap').hide();
        $('.chat-open').show();
    });
    $('.chat-open').on('click', function() {
        $('.chat-open').hide();
        $('.chat-wrap').show();
        $('#newMessage').focus();
    });

    // closes modal when escape key is pressed
    var KEYCODE_ESC = 27;
    $(document).keyup(function(e) {
        if (e.keyCode == KEYCODE_ESC) {
            $('#close_chat').click();
        }
    });

    var KEYCODE_ENTER = 13;
    $(document).keyup(function(e) {
        if (e.keyCode == KEYCODE_ENTER) {
            $('#send').click();
            e.preventDefault();
        }
    });


    $(document).mouseup(function(e) {
        var container = $(".chat-wrap");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
            $('.chat-open').show();
        }
    });
});