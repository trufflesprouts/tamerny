import { Mongo } from 'meteor/mongo';

export const TextRegistration = new Mongo.Collection('textRegistration');

TextRegistrationSchema = new SimpleSchema({
  
  phone: {
    type: Number,
    label: "Current Affiliation",
    optional: false,
    unique: true
  },

  createdAt: {
    type: Date,
    optional:false
  },

});

TextRegistration.attachSchema(TextRegistrationSchema);

