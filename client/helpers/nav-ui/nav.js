$(document).ready(function() {

    $(document).on("click", "#add_words", function() {
        $('#add_words').toggleClass('active');
        var pop = $('#pop')[0]
        pop.play();
        pop.volume = .3;
        $('.social-wrap').toggle();
        $('#footer').slideToggle(150);
        $('#name_of_word').focus();
    });

    $(document).on("click", "#delete", function() {
        var crumple = $('#crumple')[0]
        crumple.play();
        crumple.volume = .3;
    });

    stButtons.locateElements();
    // or if you want to be a bit defensive about whether the lib has been
    // loaded or not:
    if (window.stButtons) {
        stButtons.locateElements();
    } // Parse ShareThis markup

    $(document).on("click", "#chat-open", function() {
        $('#chat-open').toggleClass('active');
        var pop = $('#pop')[0]
        pop.play();
        pop.volume = .3;
        $('.chat-wrap').toggle('slide', {
            direction: 'left'
        }, 200);
        $('#newMessage').focus();
    });

    //sounds for ui
    $(document).on("click", "#word-sets-trigger", function() {
        var pop = $('#pop')[0]
        pop.play();
        pop.volume = .3;

    });

    $(document).on("click", "#devops-magnets", function() {
        var crumple = $('#crumple')[0]
        crumple.play();
        crumple.volume = .3;
    });

    $(document).on("click", "#developer-magnets", function() {
        var crumple = $('#crumple')[0]
        crumple.play();
        crumple.volume = .3;
    });

    $(document).on("click", "#all-magnets", function() {
        var crumple = $('#crumple')[0]
        crumple.play();
        crumple.volume = .3;
    });

    //mobile signin and create account css adjustments
    $(document).on('click', "#login-sign-in-link, .login-buttons", function() {
        $('.nav-collapse').css('height', '405px');
    });

    $(document).on('click', "#signup-link", function() {
        $('.nav-collapse').css('height', '475px');
    });

    $(document).on('click', "#back-to-login-link", function() {
        $('.nav-collapse').css('height', '405px');
    });

    $(document).on('click', "#login-name-link", function() {
        $('.nav-collapse').css('height', '395px');
    });

    $(document).on('click', "#login-close-text", function() {
        $('.nav-collapse').css('height', 'auto');
    });

    $(document).on('click', "#login-buttons-open-change-password", function() {
        $('.nav-collapse').css('height', '560');
    });

    $(document).on('click', "#login-buttons-do-change-password", function() {
        $('.nav-collapse').css('height', 'auto');
    });

    $(document).on('click', "#login-buttons-logout", function() {
        $('.nav-collapse').css('height', 'auto');
    });

    $(document).on('click', "#login-buttons-password", function() {
        $('.nav-collapse').css('height', '305px');
    });

    $(document).on('click', "#login-buttons .login-close-text", function() {
        $('.nav-collapse').css('height', 'auto');
    });

});
