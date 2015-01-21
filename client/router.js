Router.map(function() {
    this.route('home', {
        path: '/'
    });
    var user = Meteor.userId();
    this.route('private', {
        path: '/' + user
    });
});


