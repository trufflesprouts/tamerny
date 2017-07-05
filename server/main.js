import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { OperatorProfile } from '../collections/operatorProfile.js'

Meteor.startup(() => {
  // code to run on server at startup
});

// Send registration Link
// var sendTextRegistrationLink = function(recipientPhone){
//   var request = require('request');

//     var txt = "To start  using Tamerny please activate your number by registering through this link (LINK)"
//     request({
//       method: 'POST',
//       url: 'http://api.unifonic.com/rest/Messages/Send',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: "AppSid=KsH1cs6qIn3agrr3BeFIPS1200pojL&Recipient="+recipientPhone+"&Body="+txt
//     }, function (error, response, body) {
//     })
// }

Meteor.methods({

  updateBalance: function(amount){
  	UserProfiles.update({userId: Meteor.userId()}, {$set: {balance: amount}});
  },
  operatorSeeking: function(userId){
    console.log("Operator is now seeking")
    OperatorProfile.update({userId: userId}, {$set: {seeking: true}});
  },
  clearUser: function(userId){
    // Accounts.removeEmail(userId, oldEmail)
    Meteor.users.remove({_id: userId});
    // console.log("user cleared on server")
  },
  addRoll: function(userId, roll){
    UserProfiles.update({userId: userId}, {$push: {roles: roll}}) 
  },
  // sendTxt: function(userId, userPhone, operatorId){
  sendTxt: function(recipientPhone, recipientId, txt, operatorId){
    
    // console.log("Message should be sent from the user!")
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
              chat: {"from":'operator',"operatorId":operatorId,"createdAt":(new Date()),"success":success}
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
  console.log("Created new Chats user")
  Chats.insert({userId: userId});
});

// Emergency fetch Inbox data

// setInterval(function(){
//  TextInbox()
//   console.log("Fetching inbox has been called")
// }, 5000);

