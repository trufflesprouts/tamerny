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
    optional: false,
    unique: true
  },

  balance: {
    type: Number,
    label: "Balance",
    optional: true,
    autoValue: function() {
      return 0
    }
  },

  roles: {
    type: [String],
    autoform: {
      type: "hidden"
    },
  optional: true
  }
});

UserProfiles.attachSchema(UserProfilesSchema);

