/*
This client side JS file contains the logic for
the Settings page for both the User and the
Operator in SettingsLayout.html

Templates:
  1. SettingTabs
  2. SettingsTopCard
  3. SettingsCard

*/

// Section I: onRendered

Template.SettingTabs.onRendered(function() {
  $(document).ready(function() {
    $('.collapsible').collapsible();
  });
});

Template.SettingTabs.onRendered(function() {
  $('ul.tabs').tabs();
  $('select').material_select();
});

// Section II: Functions

changePass = function(oldPass, newPass) {
  // Change password
  Accounts.changePassword(oldPass, newPass, error => {
    if (error) {
      //Bert.alert( "You have entered a wrong password", 'danger' );
      Materialize.toast('You have entered a wrong password', 4000);
    } else {
      //Bert.alert( 'You have successfully changed your password.', 'success' );
      Materialize.toast('You have successfully changed your password.', 4000);
    }
  });
};

// Section III: Events

// [Inefficient] solution for the Materialize select init bug...
Template.SettingsCard.events({
  'submit .operator': function() {
    event.preventDefault();
    FlowRouter.go('/');
    FlowRouter.go('/settings');
    console.log('Rerout from events submit');
  },
});

Template.SettingTabs.events({
  'submit .changePassword': function() {
    event.preventDefault();
    var oldPass = document.getElementById('oldPass').value;
    var newPass = document.getElementById('newPass').value;
    changePass(oldPass, newPass);
  },
  'submit .deactivateAccount': function() {
    event.preventDefault();
    if (
      confirm(
        "Are you sure you want to delete your account? this action can't be reversed."
      )
    ) {
      var user = UserProfiles.findOne({ userId: Meteor.userId() });
      Meteor.call('clearUser', Meteor.userId());
      UserProfiles.remove({ _id: user._id }, function() {
        FlowRouter.go('/');
      });
    } else {
      // Do nothing!
    }
  },
  'submit .changeEmail': function() {
    event.preventDefault();
    var newEmail = document.getElementById('newEmail').value;
    if (newEmail != '') {
      Meteor.call('isEmailValid', newEmail, function(error, result) {
        var emailValid = true;
        if (result != undefined) emailValid = result;

        if (emailValid == true) {
          // email is valid
          var account = Meteor.users.findOne({ _id: Meteor.userId() });
          var oldEmail = account.emails[0].address;
          Meteor.call('removeEmail', Meteor.userId(), oldEmail);
          Meteor.call('addEmail', Meteor.userId(), newEmail);
          Meteor.call('sendVerificationLink', Meteor.userId(), newEmail);
        } else Materialize.toast('Please enter a valid email!', 4000);
      });
    } else Materialize.toast("Email can't be empty!", 4000);
  },
});

// Section IIII: Helpers

Template.SettingsTopCard.helpers({
  role() {
    var userProfileDoc = UserProfiles.findOne({ userId: Meteor.userId() });
    var roles = userProfileDoc.roles;
    var rolesLength = roles.length;
    var op = false;

    for (var i = 0; i < rolesLength; i++) {
      if (roles[i] == 'operator') {
        op = true;
      }
    }

    if (op == true) return 'User and Operator';
    else return 'User';
  },
  basicInfo() {
    var info = UserProfiles.findOne({ userId: Meteor.userId() });
    return info;
  },
});

Template.SettingTabs.helpers({
  IsOperator() {
    var userProfileDoc = UserProfiles.findOne({ userId: Meteor.userId() });
    var roles = userProfileDoc.roles;
    var rolesLength = roles.length;
    var status = false;

    for (var i = 0; i < rolesLength; i++) {
      if (roles[i] == 'operator') status = true;
    }
    return status;
  },
});

Template.SettingsCard.helpers({
  basicInfo() {
    var info = UserProfiles.findOne({ userId: Meteor.userId() });
    return info;
  },
  userEmail() {
    return Meteor.user().emails[0].address;
  },
  user() {
    return Meteor.user();
  },
  operatorInfo() {
    var info = OperatorProfile.findOne({ userId: Meteor.userId() });
    return info;
  },
  IsOperator() {
    var userProfileDoc = UserProfiles.findOne({ userId: Meteor.userId() });
    var roles = userProfileDoc.roles;
    var rolesLength = roles.length;
    var status = false;

    for (var i = 0; i < rolesLength; i++) {
      if (roles[i] == 'operator') status = true;
    }
    return status;
  },
});
