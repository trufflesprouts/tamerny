import { Mongo } from 'meteor/mongo';

export const Pairings = new Mongo.Collection('pairings');

PairingsSchema = new SimpleSchema({
  operatorId: {
    type: String,
    label: "User ID",
    optional:true,
    unique: true
  },

  userIds: {
    type: [String],
    optional:true,
    unique: true
  },

});

Pairings.attachSchema(PairingsSchema);
