import { Mongo } from 'meteor/mongo';

export const UserTransactions = new Mongo.Collection('userTransactions');

UserTansactionsSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: false
  },

  orderId: {
    type: String,
    label: "orderId",
    optional: false,
    unique: true
  }
});

UserTransactions.attachSchema(UserTansactionsSchema);
