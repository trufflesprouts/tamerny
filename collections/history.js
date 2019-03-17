import { Mongo } from 'meteor/mongo';

export const History = new Mongo.Collection('history');

TansactionsSchema = new SimpleSchema({
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

  description: {
      type: String,
      label: "Description",
      optional: true
  },

  price: {
    type: Number,
    label: "price",
    optional: true,
    decimal: true
  },

  status: {
    type: String,
    label: "status",
    optional: false
  }
});

HistorySchema = new SimpleSchema({
    userId: {
      type: String,
      label: "User ID",
      optional: true
    },

    transactions: {
      type: [TansactionsSchema],
      label: "Transactions",
      optional: true
    }
});

History.attachSchema(HistorySchema);
