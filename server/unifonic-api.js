


/*
This server side JS file contains all the necessary logic 
for sending and recieving texts through the Unifonic API.
*/



// Section I: Imported Collections from MongoDB

import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'



// Section II: Functions

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp(name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var sendTextRegistrationLink = function(recipientPhone){
  var request = require('request');

  var txt = "Hey there! To start using Tamerny please reply with your first name, last name, and email in this order or register through www.tamerny.com"
  request({
    method: 'POST',
    url: 'http://api.unifonic.com/rest/Messages/Send',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "AppSid=KsH1cs6qIn3agrr3BeFIPS1200pojL&Recipient="+recipientPhone+"&Body="+txt
  }, function (error, response, body) {
  })
}



// Section III: API retrieval link

Picker.route('/api/webhooks/:provider', function(params, req, res, next) {
  
  // Enable registartion by text
 var query = req._parsedUrl.query
 var message = getParameterByName("message", query)
 var userPhone = getParameterByName("recipient", query)

  // Text Distribution System
  var profileDoc = UserProfiles.findOne({phone:userPhone })
  if(profileDoc == undefined){
    //unregistered = send registration link to number
    sendTextRegistrationLink(userPhone)
  } else{ //registeered
    // Add text to user chat collection
    Chats.update(
    {userId: profileDoc.userId}, 
    {
      $push: {
        chat: 
          {"from":'user',"createdAt":(new Date()),"txt":message,"success":true}
        }})
    //check if user is not paired
    var userPaired = Pairings.findOne( { userIds: { $in: [profileDoc.userId]} })
    if (userPaired != undefined){
      // user is paired
      
    } else {
      // user is not paired
      var userWaiting = WaitingUsers.findOne({ userId: profileDoc.userId })

      if(userWaiting == undefined)
        {
          console.log("User not in waiting list, add to waiting")
          WaitingUsers.insert({userId: profileDoc.userId, createdAt: (new Date())})}
      else{
        console.log("User is already in waiting list, do nothing")
      }      
    }
  }
  

  res.end();
});


