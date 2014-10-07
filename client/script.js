$(document).ready(function() {
    $('#close_chat').on('click', function() {
        $('.chat-wrap').hide();
        $('.chat-open').show();
    });
    $('.chat-open').on('click', function() {
        $('.chat-open').hide();
        $('.chat-wrap').show();
    });
});