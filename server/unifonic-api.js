


/*
This server side JS file contains all the necessary logic 
for sending and recieving texts through the Unifonic API.
*/



// Section I: Imported Collections from MongoDB

import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'
import { TextRegistration } from '../collections/textRegistration.js'



// Section II: Functions

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp(name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var sendText = function(recipientPhone, text){
  var request = require('request');

  var txt = text
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

function addTextToChat(message, Id){
  Chats.update(
    {userId: Id}, 
    {
      $push: {
        chat: 
          {"from":'user',"createdAt":(new Date()),"txt":message,"success":true}
        }})
}

// function correctEmail(email){
  
//   var user = Accounts.findUserByEmail(email)

 

//   var validEmail = // check if email is valid

//   if (user != null){
//     sendText(userPhone, "The email you sent is already registred with another phone number. Login to www.tamerny.com to change your phone number.")
//     return false
//   } else {
    
//     Meteor.call('isEmailValid', email,
//       function(error, result){
//         var emailValid = true
//           if (result != undefined)
//             emailValid = result
          
//           if (emailValid == true){
//             // valid
//             //return true
//           } else {
//             //not valid
//             sendText(userPhone, "The email you sent is not valid, please resend us your correct credentials.")
//             // return false
//           }
//       }



//   }
// }

// check if the txt is in the correct format
function textRegistration(message, phone){
  
  var txt = message.replace('[', '').replace(']', '')
  var txtArr = txt.split(',')

  if (txtArr.length == 3){ // Correct format
    
    var firstName = txtArr[0].replace(/\s/g, '');
    var lastName = txtArr[1].replace(/\s/g, '');
    var email = txtArr[2].replace(/\s/g, '');

    if (firstName != null && lastName != null){ // Name is correct

      Meteor.call('isEmailValid', email, // Validating email
        function(error, result){
          
          var emailValid = true
          
          if (result != undefined)
            emailValid = result
          
          if (emailValid == true){ // valid
            
            var user = Accounts.findUserByEmail(email)
            
            if (user != null){ // Check if email is unique
              sendText(phone, "[Email already in use] The email you sent is already registred with another phone number. Login to www.tamerny.com to change your phone number.")
              return false
              } else {
                sendText(phone, "[Good stuff] Registration is working (TESTING)")
                // register user, send temp pass to that email
                // var tempPassword = Random.secret(15)
                // Send txt saying registration is set
                // take out of textRegistration once everything works
                // send temp pass to user's email
                // delete unifonic hook after testing this
                
              }  

          } else //not valid
            sendText(phone, "[Invalid Email] The email you sent is not valid, please resend us your correct credentials.")
        }
      ) 
    }

  } else // Wrong format
    sendText(phone, "[Wrong format] To start using Tamerny either reply with the following information in this format [Firstname, lastname, email] or register through our website at www.tamerny.com")
}



// Section III: API retrieval link

Picker.route('/api/webhooks/:provider', function(params, req, res, next) {
  
 var query = req._parsedUrl.query
 var message = getParameterByName("message", query)
 var userPhone = getParameterByName("recipient", query)

  // Text Distribution System //

  var profileDoc = UserProfiles.findOne({phone:userPhone })
  if(profileDoc == undefined){ //User is unregistered

    console.log("userPhone:")
    console.log(userPhone)

    var initText = TextRegistration.findOne({phone: parseInt(userPhone)})

    console.log("Collection Returns:")
    console.log(initText)

    if (initText != undefined){ // not first text
      textRegistration(message, userPhone)
    } else {
      //insert doc to textRegistration collection
      var doc = {
        phone: userPhone,
        createdAt: new Date()
      }

      TextRegistration.insert(doc, function(err, result){
        if(err){
          // Should report this error to tech@tamerny.com?
          sendText(userPhone, "Shoot! we couldn't sign you up for some reason, please try again in a bit. Sorry :(") // Send initial registartion text
        } else
          sendText(userPhone, "Hey there! To start using Tamerny please reply with your [first name, last name, email] in this order and format or register through www.tamerny.com") // Send initial registartion text
      })
    } 

  } else {  //User is registered
    
    addTextToChat(message, profileDoc.userId)
    
    //Pairing users-operator
    var userPaired = Pairings.findOne( { userIds: { $in: [profileDoc.userId]} })
    if (userPaired == undefined){ // user is not paired
      var userWaiting = WaitingUsers.findOne({ userId: profileDoc.userId })

      if(userWaiting == undefined)
        WaitingUsers.insert({userId: profileDoc.userId, createdAt: (new Date())})
    } 

  }
  
  res.end();
});


