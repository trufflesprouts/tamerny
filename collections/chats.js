import { Mongo } from 'meteor/mongo';

export const Chats = new Mongo.Collection('Chats');

MessageSchema = new SimpleSchema({
  from: {
    type: String,
    allowedValues: ['user', 'operator'],
    label: "From",
    optional: false
  },

  operatorId: {
    type: String,
    label: "Operator Id",
    optional: true
  },

  createdAt: {
    type: Date,
    optional:false
  },

  txt: {
    type: String,
    label: "Message",
    optional: true
  },

  success: {
    type: Boolean,
    label: "Success Status",
    optional: true
  },

  MessageId: {
    type: String,
    label: "MessageID",
    optional: true
  }

});

ChatsSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: true,
  },

  chat: {
    type: [MessageSchema],
    label: "Chats",
    optional: true
  },

});

Chats.attachSchema(ChatsSchema);

