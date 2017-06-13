import { Mongo } from 'meteor/mongo';

export const WaitingUsers = new Mongo.Collection('waitingUsers');

WaitingUsersSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional:false
  },

  createdAt: {
    type: Date,
    optional:false
  },
  
});

WaitingUsers.attachSchema(WaitingUsersSchema);

