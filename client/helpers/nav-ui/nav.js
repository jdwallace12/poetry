  $(document).ready(function() {

            $(document).on("click", "#add_words", function() {
            $('#add_words').toggleClass('active');
            var pop = $('#pop')[0]
            pop.play();
            pop.volume = .3;
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


        $(document).on("click", "#word-sets-trigger", function() {
            $('#word-sets').toggleClass('active');
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



     $(document).on("click", "login-buttons-logout", function() {
        $('#loginModal').modal('hide');
     });    

    });
