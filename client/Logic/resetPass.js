/*
This client side JS file contains the logic for the User reset password functionality

Templates:
  1. ResetPassLayout
  2. ResetPassLinkLayout

*/

// Section I: Events

Template.ResetPassLinkLayout.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = event.target.resetEmail.value;
    console.log(email);
    Meteor.call('sendForgotPassLink', email);
  },
});

Template.ResetPassLayout.events({
  'submit form': function(event) {
    event.preventDefault();
    var pass1 = event.target.password.value;
    var pass2 = event.target.passwordCheck.value;
    var token = FlowRouter.getParam('token');

    if (pass1 == pass2) {
      Accounts.resetPassword(token, pass1, function(error) {
        if (error) Materialize.toast(error.reason, 4000);
        else {
          Materialize.toast('Great, your password has been changed!', 4000);
          FlowRouter.go('/');
        }
      });
    } else {
      Materialize.toast("Passwords don't match", 4000);
    }
  },
});

// Section I: Functions
