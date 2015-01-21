Router.map(function() {
    this.route('home', {
        path: '/',
        subscription: function() {
            return Magnets.find({
             
            });
        }
    });

    var user = Meteor.userId();
    this.route('private', {
        path: '/' + user,
        subscription: function() {
            var user = Meteor.userId();

            return Magnets.find({
                fridgeId: user
            }, {
                reactive: false
            });
        }
    });
});
