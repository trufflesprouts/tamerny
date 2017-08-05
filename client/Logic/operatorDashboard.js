
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

// import '../layouts/OperatorDashboardLayout.html';

// Section I: Import Collections from MongoDB

import { Session } from 'meteor/session'
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
window.Addresses = Addresses
window.Favorites = Favorites




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
    $('.modal').modal();
  });
});



// Section III: Events

Template.editAddress.events({
  'click .delete-address':function(){
    event.preventDefault();
    var title = FlowRouter.getQueryParam('editAddress');
    var customerId = FlowRouter.getParam('customer');
    Meteor.call('deleteAddress', customerId, title, 
      function(error, result){
        if (error == undefined){
          $('#editAddress').modal('close');
          $('.collapsible').collapsible('open', 0);
          $('.collapsible').collapsible('close', 0);
          Materialize.toast("You have deleted an address", 4000)
        } else {
          Materialize.toast("Shoot, couldn't delete the address", 4000)
        }  
      });
  },
  'click .edit-close-modal': function(){
    $('#editAddress').modal('close');
  }
})

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
  'click .editFavorite' (){
    var oldkeyword = document.getElementById('key').getAttribute('value');
    var newkeyword = document.getElementById('key_word').value;
    console.log(oldkeyword + '-' + newkeyword)
    Meteor.call('editFavorite', this.customerId, oldkeyword, newkeyword);
  },
  'click .deleteFavorite' (){
    var oldkeyword = document.getElementById('key').getAttribute('value');
    console.log(oldkeyword)
    Meteor.call('deleteFavorite', this.customerId, oldkeyword);
  },
  'click .set_title_session' (){
    var title = document.getElementById('address_to_edit').value;
    console.log("title session to edit")
    console.log(title)
    
    Session.set({
      address_title: title
    });

    console.log("From session")
    console.log(Session.get('address_title'))
  }
})

Template.addFavorite.events({
  'click .addFavorite' (){
    event.preventDefault();
    var txt = document.getElementById('favorite').value;
    
    var doc = Favorites.findOne({
      '$and' :[ 
        {"userId": this.customerId}, 
        {"key": {$elemMatch: {keyWord: txt}}}
      ]})

    if (txt == ""){
      Materialize.toast("Favorite Can't be empty!", 4000)
    } else if (doc != undefined){
      Materialize.toast("Favorite must be unique!", 4000)
    } else {
      Meteor.call('addFavorite', this.customerId, txt, function(err, resp){
      if (err)
         Materialize.toast("Sorry couldn't add a favorite", 4000) 
      else {
        Materialize.toast("A new favorite has been added", 4000)
        $('#addFavorite').modal('close');
        $('#favorite').val('')
      }
    });
    }
  },
})

Template.addAddress.events({
  'click .addAddress' (){
    event.preventDefault();
    var title = document.getElementById('addtitle').value;
    var line1 = document.getElementById('addline1').value;
    var line2 = document.getElementById('addline2').value;
    var city = document.getElementById('addcity').value;
    var prov = document.getElementById('addprovince').value;
    var zip = document.getElementById('addzipcode').value;

    var unique = Addresses.findOne(
      {'$and' :[ 
        {"userId": this.customerId}, 
        {"address": {$elemMatch: {title: title}}}
      ]}
    )

    //console.log(title)
    // Hack-around to make unique title work (simple schema unique isn't working)
    if (unique == undefined){
      if (!title || !line1 || !city || !prov){
        Materialize.toast("Please fill in title, line1, city, province, and zip!", 4000) 
      } else {
          Meteor.call('addAddress', this.customerId, title, line1, line2, city, prov, zip, 
          function(error, result) {
            if (error == undefined) {
              $('#addAddress').modal('close');
              $('#addline1').val('') // Clear texting form
              $('#addline2').val('') // Clear texting form
              $('#addcity').val('') // Clear texting form
              $('#addprovince').val('') // Clear texting form
              $('#addzipcode').val('') // Clear texting form
              $('#addtitle').val('') // Clear texting form
              Materialize.toast("You've added a new address!", 4000)
            } 
            else {
              Materialize.toast(error.reason, 4000)
            }
        })
      } 
    } else {
      Materialize.toast("Title must be unique", 4000)
    }  
  },
  'click .add-close-modal': function(){
    $('#addAddress').modal('close');
  }
})



// Section IV: Functions

// Sexy function. Check out "moment(dateTime).calendar();"...
// since should be in Meteor.methods



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
    return userHistory
  },
  favorites (customerId){
    var userFavorites = Favorites.findOne({userId: customerId}).key.reverse();
    return userFavorites
  },
  addresses (customerId){
    var userAddresses = Addresses.findOne({userId: customerId}).address.reverse();
    return userAddresses
  },
  since (then){
    var then = then.getTime();
    var now = (new Date()).getTime();

    diff = now - then;
    if (diff/1000 < 1) {
      var difference = "Now"
    } else if (diff/(1000*60) < 1) {
      var difference = parseInt(diff/(1000)) + "s"
    } else if (diff/(1000*60*60) < 1) {
      var difference = parseInt(diff/(1000*60)) + "min"
    } else if (diff/(1000*60*60*24) < 1) {
      var difference = parseInt(diff/(1000*60*60)) + "h"
    } else if (diff/(1000*60*60*24*30) < 1) {
      var difference = parseInt(diff/(1000*60*60*24)) + "d"
    } else if (diff/(1000*60*60*24*365) < 1) {
      var difference = parseInt(diff/(1000*60*60*24*30)) + "m"
    } else {
      var difference = parseInt(diff/(1000*60*60*24*365)) + "y"
    }
    return difference
  },
  notEmpty(variable){
    if (variable != "")
      return true
    else
      return false
  },
  addAddressQuery(title){
    return "?editAddress="+title
  },
  addFavoriteQuery(key){
    // $('#editFavorite').modal('open');
    return "?editFavorite="+key
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

Template.editAddress.helpers({
    addressEdit(){
    var customerId = FlowRouter.getParam('customer');
    var address = Addresses.findOne({userId: customerId})
    return address
  },
  specificAddress(doc, title){
    var addresses = doc.address
    for (var i = 0; i < addresses.length; i++) {
      if (addresses[i].title == title){
        var init = "address." + i +"."
        var loc = { title: init+'title', line1: init+'line1', line2: init+'line2', city: init+'city', province: init+'province', zipCode: init+'zipCode'}
        return loc
        break;
      }
    }
  },
  editTitle(){
    var title = FlowRouter.getQueryParam('editAddress');
    return title
  }
})

Template.OperatorDashboardLayout.helpers({
  isOperator(){
    var doc = UserProfiles.findOne({userId: Meteor.userId()})
    var roles = doc.roles

    if (roles.length > 1)
      return true
    else
      FlowRouter.go('/'); // redirect, not an operator
  },
})












