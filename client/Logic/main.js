
/*
This client side JS file contains Global Helpers/Functions along 
with AutoForm manual validations and the logic for MainLayout.html which 
is the mother of all other html pages

Templates:
  1. MainLayout

*/



// Section I: Imported collections from MongoDB

import { UserProfiles } from '../../collections/userProfiles.js'
import { TopUp } from '../../collections/topup.js'
import { OperatorProfile } from '../../collections/operatorProfile.js'
import { Pairings } from '../../collections/pairedUsers.js'

window.UserProfiles = UserProfiles
window.TopUp = TopUp
window.OperatorProfile = OperatorProfile
window.Pairings = Pairings



// Section II: AutoForm Manual Validations

// Payment system
var moyasar = new (require('moyasar'))('pk_test_aFqrpMm9qbzf7WxwvWfToDYiBJMt8foU5aDnGSWH');


var correct = false;

AutoForm.hooks({
  insertTopUpForm: {
    before: {
      insert: function (doc) {
        var paymentTest = moyasar.payment.create({
          // Convert from Riyals to Halalas
          amount: (100*doc.amount),
          currency: doc.currency,
          description: doc.description,
          source: {
           type: 'creditcard',
           name: doc.name,
           number: doc.number,
           cvc: doc.cvs,
           month: doc.month,
           year: doc.year
          }
          })
        .then( function(payment){

          console.log("payment status")
          console.log(payment)
          if (payment.status == "paid"){
            console.log("accepted")
             correct = true;
             updateTopUp(true, doc._id, doc.amount)
          }
        });

          setTimeout(updateTopUp(false, doc._id, false), 10000); // check again in a second
          return doc;
      },
      onError: function(formType, error) {
        Materialize.toast(error, 1000)
      },
    },
  },

  userUpdateForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    }
  },

  upsertOperatorForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    }
  },

  updatePaymentForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    }
  },

  profileOperatorUpdate: {
    onSuccess: function(formType, result) {
      Materialize.toast("Perfect, your information was updated!", 1000)
    },

    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    } ,

  },

  updateOperatorForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    },
    onSuccess: function(formType, result) {
      Materialize.toast("Perfect, your information was updated!", 1000)
    },
  },

  updateNameForm: {
    onError: function(formType, error) {
      Materialize.toast(error, 1000)
    },
    onSuccess: function(formType, result) {
      Materialize.toast("Perfect, your information was updated!", 1000)
    },
  },

});



// Section III: Functions

function updateTopUp(status, id, amount){

  if (correct == false){
    TopUp.remove({_id: id});
  }else {
    var user = UserProfiles.findOne({userId: Meteor.userId()});
    Meteor.call('updateBalance', (amount+user.balance) ,function(err, response) {});
  }
}



// Section IIII: Global Helpers

Template.registerHelper( 'SecureDashboardLink', () => {
  var doc = Pairings.findOne({operatorId: Meteor.userId()});
  var operatorCustomers = doc.userIds
  var customerId = FlowRouter.getParam("customer")
  var customersCount = operatorCustomers.length

  if (customersCount > 0)
  {
    // got customers
    var safe = false;
    for (var i = customersCount - 1; i >= 0; i--) {
      if (operatorCustomers[i] == customerId){
        safe = true
        break;
      }
    };

    if (safe == true){
      return customerId
    } else {
      FlowRouter.go('/operatorDashboard/'+ operatorCustomers[0]);
    }

  } else {
    FlowRouter.go('/operatorDashboard/noCustomers');
  }
});

// Very inefficient, chnage to find with limit and make it not fetch info from DB 8 times... just once
Template.registerHelper('basicInfoComplete', function(){
  var doc = UserProfiles.findOne({userId: Meteor.userId()})

  if(doc == undefined)
    return false
  else
    return true
});

// Needs to actually check
Template.registerHelper('operatorProfileComplete', function(){
  var doc = OperatorProfile.findOne({userId: Meteor.userId()})

  if(doc == undefined)
    return false
  else
    return true
});

//Needs to actually check
Template.registerHelper('paymentComplete', function(){
  return true
});

Template.registerHelper('and',function(a,b){
  return a && b ;
});

Template.registerHelper('or',function(a,b){
  return a || b;
});



// Section V: Mainlayout Helpers

Template.MainLayout.helpers({
  emailNotVerified(){
    var doc = Meteor.users.findOne({_id: Meteor.userId()});
    if (doc != undefined)
      var emailStatus = doc.emails[0].verified
    else
      var emailStatus = true
    return !emailStatus
  },
  emailVar(){
    var doc = Meteor.users.findOne({_id: Meteor.userId()});
    if (doc != undefined)
      var email = doc.emails[0].address
    else
      var email = doc.emails[0].address
    return email
  }
})



// Section IV: Mainlayout Events

Template.MainLayout.events({
  'click .resend-email': function(){
    event.preventDefault();
    var emailVar = Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address
    Meteor.call('sendVerificationLink', Meteor.userId(), emailVar);
    Materialize.toast('Verification email was sent to ' + emailVar , 4000)

  }
})



// Section IIV: Server Calling Client Methods (ClientCall)

Meteor.ClientCall.setClientId(Meteor.userId());

Meteor.ClientCall.methods({
  'materializeToast': function(message, time) {
    Materialize.toast(message, time)
    console.log("TOAST SHOULD SHOW")
  },

});



// Section IIIV: Debug

AutoForm.debug();
SimpleSchema.debug = true;

