Router.map(function(){


    this.route('home', {path: '/'} );
  user = Meteor.userId();
    this.route('private', {path:'/' + user });
  
});
