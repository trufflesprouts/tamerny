
/*
This client side JS file contains the logic for the User login/Signup in Navbar.html

Templates:
  1. Navbar
  2. navbarAccount

*/



// Section I: Import Collections from MondoDB

import { UserProfiles } from '../../collections/userProfiles.js'
window.UserProfiles = UserProfiles



// Section II: Functions
function validPhone(phoneNumber){
  var str = phoneNumber.toString();
  var length = str.length
  if (length == 14 && str.substr(0, 6) == '009665'){
    return true
  } else if (length == 12 && str.substr(0, 4) == '9665'){
    return true
  } else if (length == 10 && str.substr(0, 2) == '05'){      
    return true
  } else {
    //Phone number is incorrect
    return false
  }
}

function formatNumber(phoneNumber){
  var str = phoneNumber.toString();
  var length = str.length
  
  if (length == 14 && str.substr(0, 6) == '009665'){
    return parseInt(str.substr(2, 12))
  } else if (length == 12 && str.substr(0, 4) == '9665'){
    return parseInt(str.substr(0, 12))
  } else if (length == 10 && str.substr(0, 2) == '05'){      
    return parseInt('966' + str.substr(1, 9))
  } 
}



// Section III: Events

Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
    
    // Variables retrieved from the login modal form
    var emailVar = event.target.loginEmail.value;
    var passwordVar = event.target.loginPassword.value;
    Meteor.loginWithPassword(emailVar, passwordVar, function (err){
      if(err)
        Materialize.toast(err, 1000)
      else
        $('#login').modal('close');
    });
  }
});

Template.signup.events({
  'submit form': function(event) {
    event.preventDefault();

    // Variables retrieved from the signup modal form
    var emailVar = event.target.signupEmail.value;
    var passwordVar = event.target.signupPassword.value;
    var firstNameVar = event.target.signupFirstName.value;
    var lastNameVar = event.target.signupLastName.value;
    var numberVar = event.target.signupNumber.value;
    // var pilotVar = event.target.signupPilot.value;

    // Checking if Phone number is valid
    if (validPhone(numberVar)){
      var number = formatNumber(numberVar)
      console.log("number")
      console.log(number)
      Accounts.createUser({
        email: emailVar,
        password: passwordVar

      }
      ,function(err){
        if (err)
        {
          Materialize.toast(err.reason, 1000)} // Signup was not successful
        else {
          // signup was successful
          // Create the user profile variable that will be inserted in UserProfiles collection
          var newUserProfile = {
            userId: Meteor.userId(),
            firstName: firstNameVar,
            lastName: lastNameVar,
            phone: number,
            balance: 0,
          }
          
          UserProfiles.insert(newUserProfile,function(err, result){
            if (err){
              Meteor.call('clearUser', Meteor.userId());
              Materialize.toast(err, 1000)
            }
            else{
              Meteor.loginWithPassword(emailVar, passwordVar, function (err){
                if(err)
                  Materialize.toast(err, 1000)
                else{
                  $('#login').modal('close');
                  Meteor.call('sendVerificationLink', Meteor.userId(), emailVar);
                  Meteor.call('sendTxt',phoneNumber, customerId, "Amazing! We've just successfully setup your account. I'm going to be your personal assistant fron now on. You can ask me to order you things, reserve stuff for you, deliver things for you and much more. Can I help you with anything?", (Meteor.userId()));
                }
              });
            }
          });
        }
      });
      } else {
        Materialize.toast('Please input correct Saudi phone number. (Landlines are not included)', 1000)
      }
    }
  });