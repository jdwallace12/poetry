Router.map(function(){

  user = Meteor.userId();
    this.route('home', {path: '/'} );

    this.route('private', {path:'/' + user});
  
});
