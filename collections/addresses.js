import { Mongo } from 'meteor/mongo';

export const Addresses = new Mongo.Collection('addresses');

AddressSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Label",
    optional: true
  },

  line1: {
    type: String,
    label: "Line 1",
    optional: false
  },

  line2: {
    type: String,
    label: "Line 2",
    optional: true
  },

  city: {
    type: String,
    label: "City",
    optional: false
  },

  province: {
    type: String,
    label: "Province",
    optional: false
  },

  zipCode: {
    type: Number,
    label: "Zip Code",
    optional: true
  }
});

AddressesSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: true
  },

  address: {
    type: [AddressSchema],
    label: "Address",
    optional: true
  }
});

Addresses.attachSchema(AddressesSchema);
