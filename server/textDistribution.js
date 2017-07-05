import { UserProfiles } from '../collections/userProfiles.js'
import { Chats } from '../collections/chats.js'
import { Pairings } from '../collections/pairedUsers.js'
import { WaitingUsers } from '../collections/waitingUsers.js'

// Text distribution is currently not based on user/operator location
// Text distrubution only takes language into consideration



Meteor.methods({

  fetchUsers: function(){
    var waitingUsers = WaitingUsers.find().limit(3);

    do {
      console.log("Looking for users to serve")
      waitingUsers = WaitingUsers.find().limit(3);
    }
    while (waitingUsers.length == 0);

    console.log("Found users to serve")
    //pop-up with user info and attemp to pair the hoes

  },
})