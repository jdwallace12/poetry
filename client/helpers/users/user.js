Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
});



// Deps.autorun(function(){
//   if(Meteor.userId()){
//   if (window.location.href.indexOf('reload')==-1) {
//      window.location.replace(window.location.href+'?reload');
// }
//   }
// });


Template.home.usersOnline = function() {
return Meteor.users.find({ "status.online": true });

};


Houston.menu({
  'type': 'link',
  'use': '#',
  'title': 'Delete all Magnets',
  'target': 'blank',
});