import { Mongo } from 'meteor/mongo';

export const TopUp = new Mongo.Collection('topUp');

TopUpSchema = new SimpleSchema({
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

  amount: {
    type: Number,
    label: "Amount",
    optional: false
  },

  currency: {
    type: String,
    label: "Currency",
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      return "SAR"
    }
  },

  description: {
    type: String,
    label: "Description",
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      return "online topUp"
    }
  },

  type: {
    type: String,
    label: "Amount",
    optional: true
  },

  username: {
    type: String,
    label: "Sadad Username",
    optional: true
  },

  name: {
    type: String,
    label: "Card Holder's Name",
    optional: true
  },

  number: {
    type: Number,
    label: "Card Number",
    optional: true
  },

  cvs: {
    type: Number,
    label: "CVS",
    optional: true
  },

  month: {
    type: Number,
    label: "Expiration Month",
    optional: true
  },

  year: {
    type: Number,
    label: "Expiration Year",
    optional: true
  },

});

TopUp.attachSchema(TopUpSchema);
