import { Mongo } from 'meteor/mongo';

export const Favorites = new Mongo.Collection('favorites');

KeySchema = new SimpleSchema({
  keyWord: {
    type: String,
    label: "Key Word",
    optional: false
  },

  time: {
    type: Date,
    label: "Time",
    optional: false
  }
});

FavoritesSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: true
  },

  key: {
    type: [KeySchema],
    label: "Key",
    optional: true
  }
});

Favorites.attachSchema(FavoritesSchema);
