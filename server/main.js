import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { OperatorProfile } from '../collections/operatorProfile.js'
import { History } from '../collections/history.js'
import { Favorites } from '../collections/favorites.js'
import { Addresses } from '../collections/addresses.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'

Meteor.startup(() => {
  // code to run on server at startup
});


function findCutomer (operatorId){
  console.log("searching for user to connect")
  // check in which order we are assigning order and make sure it's in correct order
  var usersWaiting = WaitingUsers.find({},{limit: 20}).fetch()
  console.log("Users Waiting:")
  console.log(usersWaiting)

  if (usersWaiting.length > 0){
    for (var i = 0; i <= usersWaiting.length - 1; i++) {
      var status = WaitingUsers.remove({_id: usersWaiting[i]._id});
      console.log("remove status:")
      console.log(status)
      if (status == 1){
        Pairings.update({operatorId: operatorId}, {$push: {userIds: usersWaiting[i].userId}})
        OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
        Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast', ['[New User] You got assined a new customer to serve !', 4000], function(error, result) {
        console.log('CALLBACK', result);
      });
        // Trigger modal to notify operator and send auto generated text to the user!
        break;
      }

      OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
      Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast', ['System is congested, try again in a bit', 4000], function(error, result) {
        console.log('CALLBACK', result);
      });

    };
  }  else {

    OperatorProfile.update({userId: operatorId}, {$set: {seeking: false}});
    Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast', ['There are currently no users waiting to be served, try again in a bit', 4000], function(error, result) {
        console.log('CALLBACK', result);
      });
  }
}

Meteor.methods({

  updateBalance: function(amount){
    var uId = Meteor.userId();
    //var oId = access generated orderId?
  	UserProfiles.update({userId: uId}, {$set: {balance: amount}});
    //Transactions.insert({orderId: oId, time: new Date()}, {$set: {price: amount}});
    //UserTransactions.insert({userId: uId, orderId: oId});
  },
  operatorSeeking: function(userId){
    console.log("Operator is now seeking")
    OperatorProfile.update({userId: userId}, {$set: {seeking: true}});

    findCutomer(userId); //find user to connect to

  },
  operatorNotSeeking: function(userId){
    console.log("Operator cancelled seeking = is not seeking")
    OperatorProfile.update({userId: userId}, {$set: {seeking: false}});
  },
  clearUser: function(userId){
    // Accounts.removeEmail(userId, oldEmail)
    Meteor.users.remove({_id: userId});
    // remove user information from other collections
    // console.log("user cleared on server")
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
  // sendTxt: function(userId, userPhone, operatorId){
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
      // console.log('Status:', response.statusCode);
      // console.log('Headers:', JSON.stringify(response.headers));
      // console.log('Response:', body);

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
  // USE ONLY FOR BACKUP TO FETCH TEXTS IF API STOPPED WORKING
  // TextInbox: function(){
  //   var request = require('request');

  //   request({
  //     method: 'POST',
  //     url: 'http://api.unifonic.com/rest/Messages/Inbox',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: "AppSid=KsH1cs6qIn3agrr3BeFIPS1200pojL&Number=966508009295"
  //   },  Meteor.bindEnvironment( function (error, response, body) {
  //     // console.log('Status:', response.statusCode);
  //     // console.log('Headers:', JSON.stringify(response.headers));
  //     // console.log('Response:', body);
  //     obj = JSON.parse(body);

  //     if(obj.success == "true" && obj.data.Message != "No messages found;"){
  //       console.log("Got TXT")
  //       //If registered insert in correct place
  //       //If not registered send a link back
  //       var messages = obj.data.Messages // array of all messages
  //       var numMessages = obj.data.NumberOfMessages // number of messages

  //       for (var i = 0; i < numMessages; i++) {
  //         messageDoc = messages[i]
  //         var userPhone = messageDoc.MessageFrom
  //         var profileDoc = UserProfiles.findOne({phone:userPhone })
  //         if(profileDoc == undefined){
  //           //unregistered = send registration link to number
  //           console.log("SEND REGISTRATION LINK, Number is not registered")
  //           sendTextRegistrationLink(userPhone)
  //         } else{ //registeered
  //           console.log("USER IS REGISTERED")
  //           Chats.update(
  //           {userId: profileDoc.userId},
  //           {
  //             $push: {
  //               chat:
  //                 {"from":'user',"createdAt":(new Date()),"txt":messageDoc.Message,"success":true}
  //               }})
  //         }
  //       }
  //     }
  //   }));

  // },
// Add more server functions here
})

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



// Emergency fetch Inbox data

// setInterval(function(){
//  TextInbox()
//   console.log("Fetching inbox has been called")
// }, 5000);
