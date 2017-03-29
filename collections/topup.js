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
    optional: false,
    autoValue: function() {
      return 'creditcard'
    }
  },

  name: {
    type: String,
    label: "Card Holder's Name",
    optional: false
  },

  number: {
    type: Number,
    label: "Card Number",
    optional: false
  },

  cvs: {
    type: Number,
    label: "CVS",
    optional: false
  },

  month: {
    type: Number,
    label: "Expiration Month",
    optional: false
  },

  year: {
    type: Number,
    label: "Expiration Year",
    optional: false
  },
  
});

TopUp.attachSchema(TopUpSchema);

