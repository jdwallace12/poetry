Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});


Template.home.usersOnline = function() {
    return Meteor.users.find({
        "status.online": true
    });

};
