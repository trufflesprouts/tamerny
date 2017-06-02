import { UserProfiles } from '../collections/userProfiles.js'

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({

  updateBalance: function(amount){

  	UserProfiles.update({userId: Meteor.userId()}, {$set: {balance: amount}});
  },
  clearUser: function(userId){
    // Accounts.removeEmail(userId, oldEmail)
    Meteor.users.remove({_id: userId});
    console.log("user cleared on server")
  }

})
