import { Mongo } from 'meteor/mongo';

export const Pairings = new Mongo.Collection('pairings');

PairingsSchema = new SimpleSchema({
  operatorId: {
    type: String,
    label: "User ID",
    optional:false
  },

  userIds: {
    type: [String],
    optional:false
  },
  
});

Pairings.attachSchema(PairingsSchema);

