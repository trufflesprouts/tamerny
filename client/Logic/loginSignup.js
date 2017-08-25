
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
  },
  'click .forgotPass': function(event) {
      $('#login').modal('close');
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

    if (passwordVar != "") // pass not empty
    {
      if (validPhone(numberVar)){ // phone is valid
        Meteor.call('isEmailValid', emailVar,
          function(error, result){
            var emailValid = true
            if (result != undefined)
              emailValid = result
            
            if (emailValid == true){ // email is valid

              var number = formatNumber(numberVar)
              Meteor.call('newUser', emailVar, passwordVar, function(err, response) {
                if (response.error != undefined) // meteor user not created
                  Materialize.toast(response.reason, 1000)
                else {
            
                  var doc = Meteor.call('getUserIdWithEmail', emailVar, 
                    function(error, response) {
                      if (error == undefined){
                        var userId = response
                        var newUserProfile = {
                          userId: userId,
                          firstName: firstNameVar,
                          lastName: lastNameVar,
                          phone: number,
                        }
                        UserProfiles.insert(newUserProfile, function(err, result){
                          if(err){
                           console.log("error inserting userprofiles")
                           console.log(err)
                           Meteor.call('clearUser', userId);
                           Materialize.toast(err, 2000)
                          }
                          else {
                            Meteor.loginWithPassword(emailVar, passwordVar, function (err){
                              if(err)
                                Materialize.toast(err, 1000)
                              else{
                                $('#login').modal('close');
                                Meteor.call('sendVerificationLink', userId, emailVar);
                                Meteor.call('sendTxt',number, userId, "Amazing! We've just successfully setup your account. I'm going to be your personal assistant fron now on. You can ask me to order you things, reserve stuff for you, deliver things for you and much more. Can I help you with anything?", (Meteor.userId()));
                              }
                            });                
                          }
                        })

                      } else {
                        Meteoraterialize.toast(error.reason, 2000)
                      }
                    })
                  }
                })
              }
            else {
                  Materialize.toast('Please input a valid email.', 3000)
                }
                 }) 
      } else 
        Materialize.toast('Please input a correct Saudi phone number.', 3000)
      } else 
        Materialize.toast("Password can't be empty", 3000)
      
    }
  });