import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp(name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Send registration Link
var sendTextRegistrationLink = function(recipientPhone){
  var request = require('request');

    var txt = "To start  using Tamerny please activate your number by registering through this link (LINK)"
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

//Picker.middleware(bodyParser.json());

Picker.route('/api/webhooks/:provider', function(params, req, res, next) {
  
 var query = req._parsedUrl.query
 var message = getParameterByName("message", query)
 var userPhone = getParameterByName("recipient", query)

  // Text Distribution System
  var profileDoc = UserProfiles.findOne({phone:userPhone })
  if(profileDoc == undefined){
    //unregistered = send registration link to number
    console.log("SEND REGISTRATION LINK, Number is not registered")
    sendTextRegistrationLink(userPhone)
  } else{ //registeered
    console.log("USER IS REGISTERED")
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
    console.log("userPaired:")
    console.log(userPaired)
    if (userPaired != undefined){
      // user is paired
      console.log("User is paired, just chill")
      
    } else {
      console.log("User is not paired")
      // user is not paired
      // check if user is already in the waiting list or not
      
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