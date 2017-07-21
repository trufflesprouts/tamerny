
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

// Moyasar payment system init - the ID is only for testing and must be changed before production
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

/* 
This global helper returns the a secure CustomerID to be used in the operator dahsboard. 
If the customerID is incorrect (if the specified customer is not paired to the operator), 
then this helper will redirects the operator to a safe landing page 
*/

Template.registerHelper( 'SecureDashboardLink', () => {
  var doc = Pairings.findOne({operatorId: Meteor.userId()});
  var operatorCustomers = doc.userIds
  var customerId = FlowRouter.getParam("customer") // From the URL
  var customersCount = operatorCustomers.length // number of customers the operator is currently paired to

  if (customersCount > 0) // Checking if the operator is paired/serving any customers
  {

    var safe = false;
    /*  Checking if the CustomerID in the URL is that of a 
    // Customer who is actually paired with the operator */
    for (var i = customersCount - 1; i >= 0; i--) {
      if (operatorCustomers[i] == customerId){
        safe = true
        break;
      }
    };

    if (safe == true){
      return customerId //URL is correct and secure = return CustomerID so that operator dahsboard can be populated with data
    } else {
      FlowRouter.go('/operatorDashboard/'+ operatorCustomers[0]); // CostumerID is not paired to the operator = redirect to another customer page
    }

  } else {
    FlowRouter.go('/operatorDashboard/noCustomers'); // wrong customerID and operator is not paired to any customers = empty dashboard page
  }
});

// [Very inefficient], change to find with limit and make it not fetch info from DB 8 times... just once
Template.registerHelper('basicInfoComplete', function(){
  var doc = UserProfiles.findOne({userId: Meteor.userId()})

  if(doc == undefined)
    return false
  else
    return true
});

// This search is not exhaustive
Template.registerHelper('operatorProfileComplete', function(){
  var doc = OperatorProfile.findOne({userId: Meteor.userId()})

  if(doc == undefined)
    return false
  else
    return true
});

// This search is not exhaustive
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

