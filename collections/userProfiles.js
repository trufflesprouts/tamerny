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

   firstName: {
    type: String,
    label: "First Name",
    optional: false
  },

   lastName: {
    type: String,
    label: "Last Name",
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
    optional: true
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
