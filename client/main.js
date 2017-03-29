import { UserProfiles } from '../collections/userProfiles.js'

window.UserProfiles = UserProfiles


Template.Navbar.onRendered(function () {
  $(document).ready(function(){
    $('.modal').modal();
    $('ul.tabs').tabs();
  });
});

Template.signup.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.signupEmail.value;
      var passwordVar = event.target.signupPassword.value;
      // Creat userprofile with this data
      var nameVar = event.target.signupName.value;
      var numberVar = event.target.signupNumber.value;
      $('#login').modal('close');
      
      Accounts.createUser({
        email: emailVar,
        password: passwordVar,
        nameVar,
        numberVar
      });


    }
  });

  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;
      Meteor.loginWithPassword(emailVar, passwordVar);
      $('#login').modal('close');
    }
  });

Template.Navbar.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });

Template.Navbar.helpers({
  loginstate(state){
    if (state == "login"){
      return true;
    }else {
      return false;
    }
  }
});



// For Debugging
 SimpleSchema.debug = true;