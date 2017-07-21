
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

  updateBalance: function(amount){
    var uId = Meteor.userId();
  	UserProfiles.update({userId: uId}, {$set: {balance: amount}});
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
});

// Creat Chat History Collection
UserProfiles.after.insert(function (userId, doc) {
  Chats.insert({userId: userId});
  History.insert({userId: userId});
  Favorites.insert({userId: userId});
  Addresses.insert({userId: userId});
});

