import { Mongo } from 'meteor/mongo';

export const Transactions = new Mongo.Collection('transactions');

// TansactionsSchema = new SimpleSchema({
//   userId: {
//     type: String,
//     label: "userId",
//     optional: false
//   },
//   time: {
//     type: Date,
//     label: "time",
//     optional: false
//   },
//   text: {
//     type: String,
//     label: "text",
//     optional: false
//   }
// });
//
// Transactions.attachSchema(TansactionsSchema);
