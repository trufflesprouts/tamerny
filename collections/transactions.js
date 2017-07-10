import { Mongo } from 'meteor/mongo';

export const Transactions = new Mongo.Collection('Transactions');

TansactionsSchema = new SimpleSchema({
  timeStamp: {
    type: Time,
    label: "Time",
    optional: false
  },
  text: {
    type: String,
    label: "Time",
    optional: false
  }
});

Transactions.attachSchema(TansactionsSchema);
