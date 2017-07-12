import { Mongo } from 'meteor/mongo';

export const Info = new Mongo.Collection('info');

InfoSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: false
  },

  operatorId: {
    type: String,
    label: "Order ID",
    optional: false
  },

  keyWord: {
    type: String,
    label: "Key Word",
    optional: false
  },

  text: {
    type: String,
    label: "Text",
    optional: true
  },

  time: {
    type: Date,
    label: "Time",
    optional: false
  }
});

Info.attachSchema(InfoSchema);
