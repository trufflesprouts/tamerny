import { UserProfiles } from '../collections/userProfiles.js'

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user) {

    var newUserProfile = {
        userId: user._id,
        name: options.nameVar,
        phone: options.numberVar,
        balance: 0
      }
    UserProfiles.insert(newUserProfile);
    return user;

});

Meteor.methods({

updateBalance: function(amount){

	UserProfiles.update({userId: Meteor.userId()}, {$set: {balance: amount}});
},

})

