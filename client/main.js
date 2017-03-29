import { UserProfiles } from '../collections/userProfiles.js'
import { TopUp } from '../collections/topup.js'
import { Operators } from '../collections/operators.js'

window.UserProfiles = UserProfiles
window.TopUp = TopUp
window.Operators = Operators

// console.log(FlowRouter.current().route) -> use to do operator login

var moyasar = new (require('moyasar'))('pk_test_aFqrpMm9qbzf7WxwvWfToDYiBJMt8foU5aDnGSWH');

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
      var pilotVar = event.target.signupPilot.value;
      
      if (pilotVar == "alrashidpilot"){
        $('#login').modal('close');
        
        Accounts.createUser({
          email: emailVar,
          password: passwordVar,
          nameVar,
          numberVar
        });
      } else {
      Materialize.toast('Incorrect Pilot Code!', 1000)
    }
    } 
  });

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
      }      
      },
    },
});

function updateTopUp(status, id, amount){
  console.log("updated correct value")
  console.log(status);
  console.log("updated balance value")
  console.log(amount);

  if (correct == false){
    TopUp.remove({_id: id});
  }else {
    console.log("life is good")
    var user = UserProfiles.findOne({userId: Meteor.userId()});
    Meteor.call('updateBalance', (amount+user.balance) ,function(err, response) {});
  }

}

  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;
      Meteor.loginWithPassword(emailVar, passwordVar);

      if (Meteor.user())
      $('#login').modal('close');
    }
  });

  Template.HomeLayout.events({
    'submit form': function(event) {
      event.preventDefault();
      
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

Template.HomeLayout.helpers({
  balance(){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    return userProfileDoc.balance;
  }
})



// For Debugging
 SimpleSchema.debug = true;