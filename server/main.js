
/*
This server side JS file contains Server methods that are called from the clients,
 functions that are called from the server methods, and general hooks that create
 documents in collections once the user/operator signsup

*/



// Section I: Imported collections from MongoDB

import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { OperatorProfile } from '../collections/operatorProfile.js'
import { History } from '../collections/history.js'
import { Favorites } from '../collections/favorites.js'
import { Addresses } from '../collections/addresses.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'



// Section II: Functions

function findCutomer (operatorId){
  var usersWaiting = WaitingUsers.find({},{limit: 20}).fetch()

  if (usersWaiting.length > 0){
    for (var i = 0; i <= usersWaiting.length - 1; i++) {
      var status = WaitingUsers.remove({_id: usersWaiting[i]._id});

      if (status == 1){
        Pairings.update({operatorId: operatorId}, {$push: {userIds: usersWaiting[i].userId}})
        OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
        Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast',
          ['[New User] You got assined a new customer to serve !', 4000], function(error, result) {
      });
        break;
      }

      OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
      Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast',
        ['System is congested, try again in a bit', 4000], function(error, result) {
      });

    };
  }  else {

    OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
    Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast',
      ['There are currently no users waiting to be served, try again in a bit', 4000], function(error, result) {
      });
  }
}



// Section III: Methods (Called from Client)

Meteor.methods({
  addFavorite: function(customerId, keyword){
    console.log('addFavorite called from server to add' + keyword)
    Favorites.update({userId : customerId},{$push: {key: {keyWord: keyword, time: new Date()}}});
  },
  editFavorite: function(customerId, oldKeyword, newKeyword){
    console.log('editFavorite called from server to edit ' + oldKeyword + ' with ' + newKeyword);
    Favorites.update({userId : customerId,"key.keyWord": oldKeyword},{$set: {"key.$.keyWord": newKeyword, time: new Date()}},false,true);
  },
  deleteFavorite: function(customerId, keyword){
    console.log('deleteFavorite called from server to delete ' + keyword);
    Favorites.update({userId : customerId},{$pull: {"key" : {"keyWord": keyword}}});
  },
  addAddress: function(customerId, title, line1, line2, city, prov, zip){
    console.log('addAddress called from server to add ' + title)
    Addresses.update({userId : customerId},{$push: {address: {"title": title, "line1": line1, "line2": line2, "city": city, province: prov, zipCode: zip}}});
  },
  editAddress: function(customerId, oldtitle, oldzip, line1, line2, city, prov, zip){
    console.log('addAddress called from server to edit ' + oldtitle)
    Addresses.update({userId: customerId, "address.title": oldtitle, "address.zipCode": oldzip},{$set: {"address.$.title": oldtitle, "address.$.line1": line1, "address.$.line2": line2, "address.$.city": city, "address.$.province": prov, "address.$.zipCode": zip}},false,true);
  },
  updateBalance: function(amount){
    var uId = Meteor.userId();
  	UserProfiles.update({userId: uId}, {$set: {balance: amount}},false,true);
  },
  addTransaction: function(title, amount, desc, status){
    var uId = Meteor.userId();
    History.update({userId: uId},{$push: {transactions: {"title": title, "description": desc, time: new Date(), "price": amount, "status": status}}})
  },
  fetchUsers: function(){
    var waitingUsers = WaitingUsers.find().limit(3);
    do {
      waitingUsers = WaitingUsers.find().limit(3);
    }
    while (waitingUsers.length == 0);
  },

  operatorSeeking: function(userId){
    OperatorProfile.update({userId: userId}, {$set: {seeking: true}});
    findCutomer(userId); //find user to connect to
  },
  operatorNotSeeking: function(userId){
    console.log("Operator cancelled seeking = is not seeking")
    OperatorProfile.update({userId: userId}, {$set: {seeking: false}});
  },
  // Should also clear chat, history, transactions....?
  clearUser: function(userId){
    Meteor.users.remove({_id: userId});
  },
  addRoll: function(userId, roll){
    UserProfiles.update({userId: userId}, {$push: {roles: roll}})
  },
  insertPairings: function(userId){
    console.log("Created paring hoe")
    Pairings.insert({operatorId: userId})
  },
   endPairing: function(operatorId, customerId){
    Pairings.update({operatorId: operatorId}, {$pull: {userIds: customerId}})
  },
  sendTxt: function(recipientPhone, recipientId, txt, operatorId){
    var request = require('request');

    request({
      method: 'POST',
      url: 'http://api.unifonic.com/rest/Messages/Send',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "AppSid=KsH1cs6qIn3agrr3BeFIPS1200pojL&Recipient="+recipientPhone+"&Body="+txt
    }, Meteor.bindEnvironment(function (error, response, body) {

      obj = JSON.parse(body);

      if(obj.success == "true")
        var success = true
      else
        var success = false

      var MessageId = obj.data.MessageID

        // Time is dependant on when the server recieved it, not when the user actually sent it
        if(success){
          Chats.update(
            {userId: recipientId},
            {
              $push: {
                chat:
                  {"from":'operator',"operatorId":operatorId,"createdAt":(new Date()),"txt":txt,"success":success,"MessageId":MessageId}
                }})
        }
        else{
          Chats.update(
            {userId: recipientId},
            {$push: {
              chat: {"from":'operator',"operatorId":operatorId,"createdAt":(new Date()),"success":no}
            }})
        }
    }));
  },
})



// Section IIII: Hooks

// Add user role if user profile has been created
UserProfiles.before.insert(function (userId, doc) {
  doc.roles = ["user"];
  doc.balance = 0;
});

// Creat Chat History Collection
UserProfiles.after.insert(function (userId, doc) {
  Chats.insert({userId: userId});
  History.insert({userId: userId});
  Favorites.insert({userId: userId});
  Addresses.insert({userId: userId});
});
