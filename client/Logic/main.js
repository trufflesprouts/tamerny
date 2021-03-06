/*
This client side JS file contains Global Helpers/Functions along
with AutoForm manual validations and the logic for MainLayout.html which
is the mother of all other html pages

Templates:
  1. MainLayout

*/

// Section I: Imported collections from MongoDB

import { UserProfiles } from '../../collections/userProfiles.js';
import { OperatorProfile } from '../../collections/operatorProfile.js';
import { Pairings } from '../../collections/pairedUsers.js';
import { Addresses } from '../../collections/addresses.js';
import { Session } from 'meteor/session';

window.UserProfiles = UserProfiles;
window.OperatorProfile = OperatorProfile;
window.Pairings = Pairings;
window.Addresses = Addresses;

// Section II: AutoForm Manual Validations

// Moyasar payment system init - the ID is only for testing and must be changed before production
var moyasar = new (require('moyasar'))(
  'sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2'
);

var correct = false;

AutoForm.hooks({
  userUpdateForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
  },

  userUpdateBasicForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
    before: {
      update: function(doc) {
        var num = doc.$set.phone;
        console.log(num);
        console.log(validPhone(num));
        if (validPhone(num) && AutoForm.validateForm('userUpdateBasicForm')) {
          num = formatNumber(num);
          doc.$set.phone = num;
          FlowRouter.go('/op-registration');
          return doc;
        } else {
          Materialize.toast('Please enter a correct Saudi phone number!', 4000);
          return false;
        }
      },
    },
  },

  // if (AutoForm.validateForm("userUpdateBasicForm"))
  //       FlowRouter.go('/op-registration');
  // updatePhoneForm: {
  //   before: {
  //     update: function (doc) {
  //       console.log("UPDATING PHONE")
  //       if (doc.$set != undefined){
  //         var phone = doc.$set.phone
  //         if (validPhone(phone) && AutoForm.validateForm("userUpdateBasicForm")){
  //           doc.$set.phone = formatNumber(phone)
  //           FlowRouter.go('/op-registration');
  //           return doc
  //         } else {
  //           Materialize.toast("The new phone number is incorrect. Please enter a Saudi number", 1000)
  //           return false;
  //         }
  //       } else{
  //         Materialize.toast("Phone is made up of digits with no empty spaced", 1000)
  //       }
  //     }
  //   },

  upsertOperatorForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
  },

  updatePaymentForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
  },

  profileOperatorUpdate: {
    onSuccess: function(formType, result) {
      Materialize.toast('Perfect, your information was updated!', 4000);
    },

    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
  },

  updateOperatorForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 4000);
    },
    onSuccess: function(formType, result) {
      Materialize.toast('Perfect, your information was updated!', 4000);
    },
  },

  updateNameForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000);
    },
    onSuccess: function(formType, result) {
      Materialize.toast('Perfect, your information was updated!', 4000);
    },
  },

  updateAddress: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000);
    },
    onSuccess: function(formType, result) {
      Materialize.toast("Perfect, you've edited an address!", 4000);
      $('#editAddress').modal('close');
    },
    /*  Ensures that edit button in the edit address
        collapsable opens the correct modal once the first
        update is done without a new page render  */
    formToModifier: function(modifier) {
      var mod = modifier['$set'];
      var arr = Object.values(mod);

      if (Object.keys(modifier).length == 1)
        FlowRouter.setQueryParams({ editAddress: arr[0] });

      return modifier;
    },
    before: {
      update: function(doc) {
        var customerId = FlowRouter.getParam('customer');
        var parseMe = doc.$set;
        var arr = Object.values(parseMe);

        var unique = Addresses.findOne({
          $and: [
            { userId: customerId },
            { address: { $elemMatch: { title: arr[0] } } },
          ],
        });

        if (unique == undefined) return doc;
        else {
          Materialize.toast('Title must be unique', 1000);
          return false;
        }
      },
    },
  },

  updatePhoneForm: {
    before: {
      update: function(doc) {
        console.log('geeting phone');
        console.log(doc);
        if (doc.$set != undefined) {
          var phone = doc.$set.phone;

          if (validPhone(phone)) {
            console.log('Valid Phone');
            doc.$set.phone = formatNumber(phone);
            return doc;
          } else {
            Materialize.toast(
              'The new phone number is incorrect. Please enter a Saudi number',
              1000
            );
            return false;
          }
        } else {
          Materialize.toast(
            'Phone is made up of digits with no empty spaced',
            1000
          );
        }
      },
    },
    onError: function(formType, error) {
      Materialize.toast(error, 1000);
    },
    onSuccess: function(formType, result) {
      Materialize.toast('Perfect, your information was updated!', 1000);
    },
  },

  favoritesUpdateForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000);
    },
    onSuccess: function(formType, error) {
      Materialize.toast('a favorite was successfully updated!', 1000);
    },
  },
});

// Section III: Functions

function validPhone(phoneNumber) {
  var str = phoneNumber.toString();

  var length = phoneNumber.length;
  if (length == 12 && str.substr(0, 4) == '9665') {
    return true;
  } else if (length == 9 && str.charAt(0) == '5') {
    return true;
  } else {
    return false;
  }
}

function formatNumber(phoneNumber) {
  var str = phoneNumber.toString();
  var length = str.length;

  if (length == 12 && str.substr(0, 4) == '9665') {
    return parseInt(str.substr(0, 12));
  } else if (length == 9 && str.charAt(0) == '5') {
    return parseInt('966' + str);
  }
}

// Section IIII: Global Helpers

/*
This global helper returns the a secure CustomerID to be used in the operator dahsboard.
If the customerID is incorrect (if the specified customer is not paired to the operator),
then this helper will redirects the operator to a safe landing page
*/

Template.registerHelper('SecureDashboardLink', () => {
  var doc = Pairings.findOne({ operatorId: Meteor.userId() });
  var operatorCustomers = doc.userIds;
  var customerId = FlowRouter.getParam('customer'); // From the URL
  var customersCount = operatorCustomers.length; // number of customers the operator is currently paired to
  console.log('SecureDashboardLink');
  if (customersCount > 0) {
    // Checking if the operator is paired/serving any customers
    var safe = false;
    /*  Checking if the CustomerID in the URL is that of a
    // Customer who is actually paired with the operator */
    for (var i = customersCount - 1; i >= 0; i--) {
      if (operatorCustomers[i] == customerId) {
        safe = true;
        break;
      }
    }

    if (safe == true) {
      return customerId; //URL is correct and secure = return CustomerID so that operator dahsboard can be populated with data
    } else {
      FlowRouter.go('/operatorDashboard/' + operatorCustomers[0]); // CostumerID is not paired to the operator = redirect to another customer page
    }
  } else {
    FlowRouter.go('/operatorDashboard/noCustomers'); // wrong customerID and operator is not paired to any customers = empty dashboard page
  }
});

// [Very inefficient], change to find with limit and make it not fetch info from DB 8 times... just once
Template.registerHelper('basicInfoComplete', function() {
  var doc = UserProfiles.findOne({ userId: Meteor.userId() });

  if (doc == undefined) return false;
  else return true;
});

// This search is not exhaustive
Template.registerHelper('operatorProfileComplete', function() {
  var doc = OperatorProfile.findOne({ userId: Meteor.userId() });

  if (doc == undefined) return false;
  else return true;
});

// This search is not exhaustive
Template.registerHelper('paymentComplete', function() {
  return true;
});

Template.registerHelper('and', function(a, b) {
  return a && b;
});

Template.registerHelper('or', function(a, b) {
  return a || b;
});

// Section V: Mainlayout Helpers

Template.MainLayout.helpers({
  emailNotVerified() {
    var doc = Meteor.users.findOne({ _id: Meteor.userId() });
    if (doc != undefined) var emailStatus = doc.emails[0].verified;
    else var emailStatus = true;
    return !emailStatus;
  },
  showAlert() {
    var status = Session.get('emailAlert');
    if (status == undefined) return true;
    else return status;
  },
});

Template.verify.helpers({
  emailVar() {
    var doc = Meteor.users.findOne({ _id: Meteor.userId() });
    if (doc != undefined) var email = doc.emails[0].address;
    else var email = doc.emails[0].address;
    return email;
  },
});

// Section IV: Mainlayout Events

Template.MainLayout.events({
  'click .resend-email': function() {
    event.preventDefault();
    //var emailVar = Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address
    Meteor.call(
      'sendVerificationLink',
      Meteor.userId(),
      Meteor.users.findOne({ _id: Meteor.userId() }).emails[0].address
    );
    Materialize.toast('Verification email was sent to ' + emailVar, 4000);
  },
  'click .close-modal': function() {
    Session.set({ emailAlert: false });
  },
});

// Section IIV: Server Calling Client Methods (ClientCall)

Meteor.ClientCall.setClientId(Meteor.userId());

Meteor.ClientCall.methods({
  materializeToast: function(message, time) {
    Materialize.toast(message, time);
    console.log('TOAST SHOULD SHOW');
  },
});

// Section IIIV: Debug

AutoForm.debug();
SimpleSchema.debug = true;
