import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp(name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
    Chats.update(
    {userId: profileDoc.userId}, 
    {
      $push: {
        chat: 
          {"from":'user',"createdAt":(new Date()),"txt":message,"success":true}
        }})
  }
  

res.end();
});