import { Mongo } from 'meteor/mongo';

export const Transactions = new Mongo.Collection('transactions');

TansactionsSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: "orderId",
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

  time: {
    type: Date,
    label: "time",
    optional: false
  },

  title: {
    type: String,
    label: "Order Title",
    optional: false
  },

  price: {
    type: Number,
    label: "price",
    optional: true
  },

  status: {
    type: String,
    label: "status",
    optional: false
  },

  operatorId: {
    type: String,
    label: "Operator ID",
    optional: false
  }
});

Transactions.attachSchema(TansactionsSchema);
