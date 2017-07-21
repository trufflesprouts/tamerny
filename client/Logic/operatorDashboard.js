
/*
This client side JS file contains the logic for the OperatorDashboard in OperatorDashboardLayout.html

Templates:
  1. userInfoCard
  2. userChatCard
  3. apiCard
  4. statusCard
  5. operator
  6. getUser
  7. user
  8. operator

*/



// Section I: Import Collections from MongoDB

import { UserProfiles } from '../../collections/userProfiles.js'
import { OperatorProfile } from '../../collections/operatorProfile.js'
import { Chats } from '../../collections/chats.js'
import { History } from '../../collections/history.js'
import { Favorites } from '../../collections/favorites.js'
import { Addresses } from '../../collections/addresses.js'
import { Pairings } from '../../collections/pairedUsers.js'
import { WaitingUsers } from '../../collections/waitingUsers.js'

window.UserProfiles = UserProfiles
window.OperatorProfile = OperatorProfile
window.Chats = Chats
window.Pairings = Pairings
window.WaitingUsers = WaitingUsers



// Section II: onRendered

Template.OperatorDashboardLayout.onRendered(function () {
  var customerId = FlowRouter.getParam('customer');
});

Template.user.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});

Template.statusCard.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});

Template.operator.onRendered(function () {
    $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });
});

Template.userChatCard.onRendered(function () {
  $(document).ready(function() {
    $('input#input_text').characterCounter();
    var elmnt = document.getElementById("messageBody");
    elmnt.scrollTop = elmnt.scrollHeight; // Scroll to bottom of page
  });
});

Template.userInfoCard.onRendered(function () {
  $(document).ready(function(){
    $('.collapsible').collapsible();
    $('ul.tabs').tabs();
  });
});



// Section III: Events

Template.userChatCard.events({
  'click .send-txt':function(){
    event.preventDefault();
    var txt = document.getElementById('input_text').value
    var customerId = document.getElementById('customerId').value
    var doc = UserProfiles.findOne({userId: customerId})
    var phoneNumber = doc.phone
    Meteor.call('sendTxt',phoneNumber, customerId, txt, (Meteor.userId()));
    $('#input_text').val('') // Clear texting form
  },
})

Template.statusCard.events({
    'click .done': function(event) {
      event.preventDefault();
      var doc = UserProfiles.findOne({userId: this.customerId})
      var phoneNumber = doc.phone
      var name = doc.firstName +" "+ doc.lastName
      Materialize.toast("Good Job, you've succesfully finished serving "+ name, 4000)
      Meteor.call('sendTxt',phoneNumber, this.customerId, "Good stuff! Let me know if you need anything else.", (Meteor.userId()));
      Meteor.call('endPairing', Meteor.userId(), this.customerId)
      $('.tooltipped').tooltip('remove'); // Resolves a bug that exists if you click done on the last customer you have
    },
    'click .pending': function(event) {
      event.preventDefault();
      console.log("PENDING")
      var doc = UserProfiles.findOne({userId: this.customerId})
      var phoneNumber = doc.phone
      var name = doc.firstName +" "+ doc.lastName
      Materialize.toast(name+" has been placed in pending mode ", 4000)
      Meteor.call('sendTxt',phoneNumber, this.customerId, "I've just placed you some order. I'll get back to you shortly!", (Meteor.userId()));
      // Change status to pending and thus change the color of the user in the CUSTOMERS Card
    },
    'click .cancel': function(event) {
      event.preventDefault();
      console.log("CANCEL")
      var doc = UserProfiles.findOne({userId: this.customerId})
      var phoneNumber = doc.phone
      var name = doc.firstName +" "+ doc.lastName
      Materialize.toast("Shoot! You've cancelled serving "+ name, 4000)
      Meteor.call('sendTxt',phoneNumber, this.customerId, "I'm so sorry, unfortunately I won't be able to help you with your order. Let me know if you need anything else!", (Meteor.userId()));
      Meteor.call('endPairing', Meteor.userId(), this.customerId)
      $('.tooltipped').tooltip('remove'); // Resolves a bug that exists if you click done on the last customer you have
    }
  });

Template.getUser.events({
    'click .getUser': function(event) {
      event.preventDefault();
      Meteor.call('operatorSeeking', Meteor.userId());
    },
    'click .notSeeking': function(event) {
      event.preventDefault();
      Meteor.call('operatorNotSeeking', Meteor.userId());
    }
  });

// Changing anything must be done through _id of the subcollection not userId @7mto
// You can make updates with other fields than _id if you do it from the Server with Meteor.Call.. @Jamjoom
Template.userInfoCard.events({
  'click .addFavorite' (){
    event.preventDefault();
    var txt = document.getElementById('favorite').value;
    var id = Favorites.findOne({userId : "fLsHPFSbBhxGAYA3t"})._id;
    Favorites.update({_id : id},{$push: {key: {keyWord: txt, time: new Date()}}});
  }
})



// Section IIII: Functions

// Sexy function. Check out "moment(dateTime).calendar();"... 
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



// Section V: Helpers

Template.operator.helpers({
  formatDateTime (dateTime){
    var formatted = moment(dateTime).calendar();
    return formatted
  },
})

Template.userStatus.helpers({
  customers (){
    var doc = Pairings.findOne({operatorId: Meteor.userId()});
    if(doc == undefined)
      return [] // no pairings
    else {
      var users = doc.userIds
      var userNames = UserProfiles.find({userId:{$in: users} }).fetch()
      return userNames
    }
  },
  customerPageLink (userId){
    var link = "/operatorDashboard/" + userId
    return link
  },
  servingColor(customerId){ // Highlights the customer who's currently being served
    var parameter = FlowRouter.getParam('customer');
    if(customerId == parameter)
      return "serving"
  }
})

Template.getUser.helpers({
  searching (){ // Checks if operator is seeking customers or not
    var doc = OperatorProfile.findOne({userId: Meteor.userId()});
    
    if (doc != undefined)
      var state = doc.seeking
    else
      var state = false
    
    return state
    
  },
  customersWaiting (){ // checks if there are customers waiting to be paired with operators = pulse to the add button
    var doc = WaitingUsers.find().count()
    if(doc > 0)
      return true
    else
      return false
  }
})

// Important! Change ID to a variable
Template.userInfoCard.helpers({
  userInfo (customerId){
    var userProfileDoc = UserProfiles.findOne({userId: customerId});
    return userProfileDoc
  },
  history (customerId){
    var userHistory = History.findOne({userId: customerId}).transaction.reverse();
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
  favorites (customerId){
    var userFavorites = Favorites.findOne({userId: customerId}).key.reverse();
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
  addresses (customerId){
    var userAddresses = Addresses.findOne({userId: customerId}).address.reverse();
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

Template.user.helpers({
  formatDateTime (dateTime){
    var formatted = moment(dateTime).calendar();
    return formatted
  },
})

Template.userChatCard.helpers({
  customerProfile(customerId){
    var doc = UserProfiles.findOne({userId: customerId})
    return doc
  },
  activeChat(customerId){
    var doc = Chats.findOne({userId: customerId})
    var chatHist = doc.chat
    return chatHist
  }
})

