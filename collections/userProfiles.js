import { Mongo } from 'meteor/mongo';

export const UserProfiles = new Mongo.Collection('userProfiles');

UserProfilesSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      if(this.isSet){
        return this.values
      }else {
        return this.userId
      }
    }
  },

  name: {
    type: String,
    label: "Name",
    optional: false
  },

  phone: {
    type: String,
    label: "Phone Number",
    optional: false
  },

  balance: {
    type: Number,
    label: "Balance",
    optional: false
  },

  
});

UserProfiles.attachSchema(UserProfilesSchema);

