Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
});



Deps.autorun(function(){
  if(Meteor.userId()){
  if (window.location.href.indexOf('reload')==-1) {
     window.location.replace(window.location.href+'?reload');
}
  }
});
