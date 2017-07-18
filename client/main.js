import { UserProfiles } from '../collections/userProfiles.js'
import { TopUp } from '../collections/topup.js'
import { OperatorProfile } from '../collections/operatorProfile.js'
import { Chats } from '../collections/chats.js'
import { History } from '../collections/history.js'
import { Favorites } from '../collections/favorites.js'
import { Addresses } from '../collections/addresses.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'


window.UserProfiles = UserProfiles
window.TopUp = TopUp
window.OperatorProfile = OperatorProfile
window.Chats = Chats
window.Pairings = Pairings
window.WaitingUsers = WaitingUsers

// console.log(FlowRouter.current().route) -> use to do operator login

var moyasar = new (require('moyasar'))('pk_test_aFqrpMm9qbzf7WxwvWfToDYiBJMt8foU5aDnGSWH');

Template.SettingTabs.onRendered(function () {
    $(document).ready(function(){
    $('.collapsible').collapsible();
  });
});

Template.textUser.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});


Template.statusCard.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});

Template.textOperator.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});




// DO ERROR CHECKING AND VALIDATION CORRECTLYf!!!
Template.signup.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.signupEmail.value;
      var passwordVar = event.target.signupPassword.value;
      // Creat userprofile with this data
      var firstNameVar = event.target.signupFirstName.value;
      var lastNameVar = event.target.signupLastName.value;

      console.log(firstNameVar)
      console.log(lastNameVar)
      // var nameVar = event.target.signupName.value;
      var numberVar = event.target.signupNumber.value;
      var pilotVar = event.target.signupPilot.value;

      if (pilotVar == "alrashidpilot"){

        // Change this to a regular user creation bitch
        Accounts.createUser({
          email: emailVar,
          password: passwordVar

        }

        // Meteor.users.insert({email: emailVar, password: passwordVar}
        , function(err){
          if (err)
            {console.log(err)
            Materialize.toast(err.reason, 1000)}
          else {
            var newUserProfile = {
              userId: Meteor.userId(),
              // name: nameVar,
              firstName: firstNameVar,
              lastName: lastNameVar,
              phone: numberVar,
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
                  // Still working on it!!!
                  Meteor.call('sendVerificationLink', Meteor.userId(), emailVar);
                }
              });

              }
            });
          }
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
    // Called when any submit operation succeeds
    // inefficient solution for the Materialize select init bug...Fix when I have time to scrach my ass
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

  // DO ERROR CHECKING AND VALIDATION CORRECTLY!!!

  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
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

  Template.HomeLayout.events({
    'submit form': function(event) {
      event.preventDefault();

    }
  });

Template.navbarAccount.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });

Template.Navbar.events({
  'click .open-modal': function(event) {
    event.preventDefault();
    console.log("open modal")
    FlowRouter.go('/op-registration');
    $('#login').modal('open');
  }
});

Template.Navbar.helpers({
  loginstate(state){
    if (state == "login"){
      return true;
    }else {
      return false;
    }
  },
  notOperator(){
    var user = UserProfiles.findOne({userId: Meteor.userId()});
    var numberRoles = user.roles.length
    var roles = user.roles

    var state = true
    for (i = 0; i < numberRoles; i++) {
      if (roles[i] == "operator")
        state = false
    }

    return state

  },
  dashboardLink(){
    var doc = Pairings.findOne({operatorId: Meteor.userId()})

    if (doc != undefined)
      var link = '/operatorDashboard/' + doc.userIds[0]
    else
        var link = '/operatorDashboard/noCustomer'
    
    return link
  }
});

Template.registerHelper( 'SecureDashboardLink', () => {
  console.log("Sending secure dashboard link")
  var doc = Pairings.findOne({operatorId: Meteor.userId()});
  var operatorCustomers = doc.userIds
  var customerId = FlowRouter.getParam("customer")

  var safe = false;

  for (var i = operatorCustomers.length - 1; i >= 0; i--) {
    if (operatorCustomers[i] == customerId){
      safe = true
      break;
    }
  };

  if(safe == true)
    return customerId
  else
    return "Incorrect Customer ID"
 
});

Template.HomeLayout.helpers({
  balance(){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    return userProfileDoc.balance;
  },
  userhistory (){
    var userHistory = History.findOne({userId: Meteor.userId()}).transaction.reverse();
    var transactions = document.getElementById("transaction");
    userHistory.forEach(
      function(transaction) {
        var item = "<li><div class=\"collapsible-header\"><span class=\"left\">"
                 + transaction.title
                 + "</span><span class=\"right\">"
                 + since(transaction.time)
                 + "</span></div><div class=\"collapsible-body\"><span class=\"left\">"
                 + transaction.description
                 + "</span><span class=\"right\">"
                 + transaction.price
                 + "</span><span> ("
                 + transaction.status
                 + ")</span></div></li>";
        transactions.innerHTML = transactions.innerHTML + item;
      }
    )
  }
})

Template.MainLayout.helpers({
  emailNotVerified(){
    var doc = Meteor.users.findOne({_id: Meteor.userId()});
    var emailStatus = doc.emails[0].verified
    return !emailStatus
  },
  emailVar(){
    var doc = Meteor.users.findOne({_id: Meteor.userId()});
    var email = doc.emails[0].address
    return email
  }
})

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

Template.SettingsTopCard.helpers({
  role (){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    var roles = userProfileDoc.roles
    var rolesLength = roles.length
    var op = false;

    for (var i = 0; i < rolesLength; i++){
      if (roles[i] == "operator") {
        op = true;
      }
    }

    if (op == true){
      return "User and Operator"
    } else {
      return "User"
    }

  },
  basicInfo (){
    var info = UserProfiles.findOne({userId: Meteor.userId()});
    return info
  }
})

Template.SettingTabs.helpers({
  IsOperator (){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    var roles = userProfileDoc.roles
    var rolesLength = roles.length
    var status = false;

    for (var i = 0; i < rolesLength; i++){
      if (roles[i] == "operator")
        status = true;
    }
    return status
  },
})

Template.StepAdvice.helpers({
  advice (){
    var step = FlowRouter.getParam("step")
    var advice = [
                "Validating your name, phone number, and email ensures that we can contact if there are any new updates in our platform!",
                "Filling in your credentials and expertise helps us pair you with users that you can help the most which increases your ratings!"
                ]
    return (advice[step - 1])
  },
})

//NOT DONE YOU LITTLE FUCK!!!!
Template.OperatorRegistForms.helpers({
  title(){
    var step = FlowRouter.getParam("step")
    var titles = ["Basic Information", "Education and Employment"]
    return titles[step - 1]
  },
  currentForm(){
    var step = FlowRouter.getParam("step")
    var forms = ["BasicsInfo", "OperatorInfo", "PaymentInfo"]
    return forms[step - 1]
  }
})

Template.navbarAccount.helpers({
  name (){
    var doc = UserProfiles.findOne({userId: Meteor.userId()});
    return doc.firstName
  }
})

Template.BasicsInfo.helpers({
  basicInfo (){
    var info = UserProfiles.findOne({userId: Meteor.userId()});
    return info
  }
})



Template.userStatus.helpers({
  customers (){
    var doc = Pairings.findOne({operatorId: Meteor.userId()});
    console.log("your pairings")
    console.log(doc)
    if(doc == undefined)
      return []
    else {
      var users = doc.userIds
      var userNames = UserProfiles.find({userId:{$in: users} }).fetch()
      return userNames
    }  
  },
  customerPageLink (userId){
    var link = "/operatorDashboard/" + userId
    return link
  }
})

Template.getUser.helpers({
  searching (){
    var doc = OperatorProfile.findOne({userId: Meteor.userId()});
    var state = doc.seeking
    return state
  },
  notServing (){
    var doc = Pairings.findOne({operatorId: Meteor.userId()});
    if(doc == undefined)
      return true
    else
      return false
  }
})



function since (then){
  var then = then.getTime();
  var now = (new Date()).getTime();

  diff = now - then;
  if (diff/1000 < 1) {
    var difference = "Now"
  } else if (diff/(1000*60) < 1) {
    var difference = parseInt(diff/(1000)) + " Seconds"
  } else if (diff/(1000*60*60) < 1) {
    var difference = parseInt(diff/(1000*60)) + " Minutes"
  } else if (diff/(1000*60*60*24) < 1) {
    var difference = parseInt(diff/(1000*60*60)) + " Hours"
  } else if (diff/(1000*60*60*24*30) < 1) {
    var difference = parseInt(diff/(1000*60*60*24)) + " Days"
  } else if (diff/(1000*60*60*24*365) < 1) {
    var difference = parseInt(diff/(1000*60*60*24*30)) + " Months"
  } else {
    var difference = parseInt(diff/(1000*60*60*24*365)) + " Years"
  }
  return difference
}

// Important! Change ID to a variable
Template.userInfoCard.helpers({
  userInfo (){
    var userProfileDoc = UserProfiles.findOne({userId: "fLsHPFSbBhxGAYA3t"});
    return userProfileDoc
  },
  history (){
    var userHistory = History.findOne({userId: "fLsHPFSbBhxGAYA3t"}).transaction.reverse();
    var transactions = document.getElementById("transaction");
    userHistory.forEach(
      function(transaction) {
        var item = "<li><div class=\"collapsible-header\"><span class=\"left\">"
                 + transaction.title
                 + "</span><span class=\"right\">"
                 + since(transaction.time)
                 + "</span></div><div class=\"collapsible-body\"><span class=\"left\">"
                 + transaction.description
                 + "</span><span class=\"right\">"
                 + transaction.price
                 + "</span><span> ("
                 + transaction.status
                 + ")</span></div></li>";
        transactions.innerHTML = transactions.innerHTML + item;
      }
    )
  },
  favorites (){
    var userFavorites = Favorites.findOne({userId: "fLsHPFSbBhxGAYA3t"}).key.reverse();
    var keys = document.getElementById("key");
    userFavorites.forEach(
      function(key) {
        var item = "<li><div class=\"collapsible-header\"><span class=\"left\">"
                 + key.keyWord
                 + "</span><span class=\"right\">"
                 + since(key.time)
                 + "</span><i class=\"material-icons right\">mode_edit</i></div><div class=\"collapsible-body\"><span>Edit Favorite Here</span></div></li>";
        keys.innerHTML = keys.innerHTML + item;
      }
    );
  },
  addresses (){
    var userAddresses = Addresses.findOne({userId: "fLsHPFSbBhxGAYA3t"}).address.reverse();
    var addresses = document.getElementById('address');
    userAddresses.forEach(
      function(address){
        var item = "<li><div class=\"collapsible-header\">"
                 + address.title
                 + "</div><div class=\"collapsible-body\"><span class=\"left\">"
                 + address.line1
                 + "</span><br><span class=\"left\">"
                 + address.line2
                 + "</span><br><span class=\"left\">"
                 + address.city + ',' + address.province + ' ' + address.zipCode
                 + "</span></div></li>";
        addresses.innerHTML = addresses.innerHTML + item;
      }
    );
  }
});

Template.OperatorInfo.helpers({
  upsert (){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    console.log(info)
    if (info == undefined)
      return "insert"
    else
      return "update"
  },
  updoc(){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    return info
  }
})

// Template.PaymentInfo.helpers({
//   updoc(){
//     var info = OperatorProfile.findOne({userId: Meteor.userId()});
//     return info
//   }
// })

Template.SettingsCard.helpers({
   basicInfo (){
    var info = UserProfiles.findOne({userId: Meteor.userId()});
    return info
  },
  userEmail (){
    return Meteor.user().emails[0].address;
  },
  user (){
    return Meteor.user();
  },
  operatorInfo (){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    return info
  },
  IsOperator (){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    var roles = userProfileDoc.roles
    var rolesLength = roles.length
    var status = false;

    for (var i = 0; i < rolesLength; i++){
      if (roles[i] == "operator")
        status = true;
    }
    return status
  },
})

changePass = function(oldPass, newPass){
  // Change password
    Accounts.changePassword( oldPass, newPass, ( error ) =>{
      if ( error ) {
        //Bert.alert( "You have entered a wrong password", 'danger' );
        Materialize.toast('You have entered a wrong password', 4000)
      } else {
        //Bert.alert( 'You have successfully changed your password.', 'success' );
        Materialize.toast('You have successfully changed your password.', 4000)
      }
    });
}

Template.SettingTabs.events({
  'submit .changePassword': function(){
    event.preventDefault();
    var oldPass = document.getElementById('oldPass').value
    var newPass = document.getElementById('newPass').value
    changePass(oldPass, newPass)
  },
  'submit .deactivateAccount': function(){
    event.preventDefault();
    var user = UserProfiles.findOne({userId: Meteor.userId()})

    Meteor.call('clearUser', Meteor.userId())
    UserProfiles.remove({_id: user._id})

  },
  'submit .changeEmail': function(){
    event.preventDefault();
    var newEmail = document.getElementById('newEmail').value
    if(newEmail != "")
    {
      var account = Meteor.users.findOne({_id: Meteor.userId()})
      var oldEmail = account.emails[0].address
      Meteor.call('removeEmail', Meteor.userId(), oldEmail)
      Meteor.call('addEmail', Meteor.userId(), newEmail)
      Meteor.call('sendVerificationLink', Meteor.userId(), newEmail);
    } else
    Materialize.toast("Email can't be empty!"  , 4000)

  }
});

Template.MainLayout.events({
  'click .resend-email': function(){
    event.preventDefault();
    var emailVar = Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address
    Meteor.call('sendVerificationLink', Meteor.userId(), emailVar);
    Materialize.toast('Verification email was sent to ' + emailVar , 4000)

  }
})

Template.BasicsInfo.events({
  'submit': function(){
    event.preventDefault();
    if (AutoForm.validateForm("userUpdateForm"))
      FlowRouter.go('/op-registration');
  }
})

// Changing anything must be done through _id of the subcollection not userId
Template.userInfoCard.events({
  'click .addFavorite' (){
    event.preventDefault();
    var txt = document.getElementById('favorite').value;
    var id = Favorites.findOne({userId : "fLsHPFSbBhxGAYA3t"})._id;
    Favorites.update({_id : id},{$push: {key: {keyWord: txt, time: new Date()}}});
  }
})

Template.OperatorInfo.events({
  'submit': function(){
    event.preventDefault();
    if (AutoForm.validateForm("upsertOperatorForm"))
      FlowRouter.go('/op-registration');
  },
  'click .next':function(){
    event.preventDefault();
    $(".workSettings").css('display', 'block');
    $(".eduEmp").css('display', 'none');
    },
  'click .back':function(){
    event.preventDefault();
    $(".eduEmp").css('display', 'block');
    $(".workSettings").css('display', 'none');
    },
})

Template.publishOperator.events({
  'click .publish':function(){
    event.preventDefault();
    Meteor.call('addRoll', Meteor.userId(), "operator");
    Meteor.call('insertPairings', Meteor.userId());
    FlowRouter.go('/operatorDashboard');
  },
})

Template.OperatorInfo.onRendered(function () {
  $('select').material_select();
});

Template.SettingTabs.onRendered(function () {
  $('ul.tabs').tabs();
  $('select').material_select();
});

Template.userInfoCard.onRendered(function () {
  $('ul.tabs').tabs();
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
});

Template.HomeLayout.onRendered(function () {
  $('ul.tabs').tabs();
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
})

Template.Navbar.onRendered(function () {
  $(document).ready(function(){
    $('.modal').modal();
    $('ul.tabs').tabs();
  });
});

Template.navbarAccount.onRendered(function () {
  $(document).ready(function(){
    $(".dropdown-button").dropdown({});
  });
});

Template.OperatorDashboardLayout.onRendered(function () {
  console.log("Dash is rendered")
  var customerId = FlowRouter.getParam('customer');
  console.log(customerId)
});


// THIS SECTION IS FOR TESTING

Template.TestLayout.onRendered(function () {
  $( document ).ready(function(){
    $(".dropdown-button").dropdown({});
  })
});

Template.userChatCard.onRendered(function () {
  $(document).ready(function() {
    $('input#input_text').characterCounter();
  });

});

Template.TestLayout.helpers({
  operatorInfo (){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    return info
  },
})

// Called when any submit operation succeeds
// inefficient solution for the Materialize select init bug...Fix when I have time to scrach my ass

Template.SettingsCard.events({
  'submit .operator':function(){
    event.preventDefault();
    FlowRouter.go('/')
    FlowRouter.go('/settings');
    console.log("Rerout from events submit")
  },
})

Template.userChatCard.events({
  'click .send-txt':function(){
    event.preventDefault();
    console.log("Button to send txt has been clicked")
    var txt = document.getElementById('input_text').value
    console.log("Text:")
    console.log(txt)
    // Change this number to the user the opearto is serving's phone number when i work on the distribution system
    Meteor.call('sendTxt',966504522999, 'y3W4RYKtRmZmvMPie', txt, (Meteor.userId()));
    //Recipient number, recipient user Id, txt message,  operator ID
  },
  'click .get-texts':function(){
    event.preventDefault();
    console.log("Button to send txt has been clicked")
    var txt = document.getElementById('input_text').value
    console.log("Text:")
    console.log(txt)
    // Change this number to the user the opearto is serving's phone number when i work on the distribution system
    Meteor.call('sendTxt',966504522999, 'y3W4RYKtRmZmvMPie', txt, (Meteor.userId()));
    //Recipient number, recipient user Id, txt message,  operator ID
  },

})

Template.getUser.events({
    'click .getUser': function(event) {
      event.preventDefault();
      console.log("GET USER HAS BEEN CLICKED")
      Meteor.call('operatorSeeking', Meteor.userId());
      // Pop-up with buttons and finish procedures
    },
    'click .notSeeking': function(event) {
      event.preventDefault();
      console.log("GET USER HAS CANCELLED")
      Meteor.call('operatorNotSeeking', Meteor.userId());
    }
  });

// Init for calling a clinet method from server
Meteor.ClientCall.setClientId(Meteor.userId());

Meteor.ClientCall.methods({

  'materializeToast': function(message, time) {
    Materialize.toast(message, time)
    console.log("TOAST SHOULD SHOW")
  },

});



AutoForm.debug();

// For Debugging
SimpleSchema.debug = true;

// Call Inboc

  //Meteor.call('TextInbox');
