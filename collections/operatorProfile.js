import { Mongo } from 'meteor/mongo';

export const OperatorProfile = new Mongo.Collection('operatorProfile');

OperatorProfileSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      if(this.isSet){
        return this.values
      }else {
        return this.userId
      }
    }
  },

  educationLevel: {
    type: Number,
    autoform: {
          options: [
            {label: "Primary School", value: 1},
            {label: "Secondary School", value: 2},
            {label: "Undergraduate Degree", value: 3},
            {label: "Graduate Degree", value: 4},
            {label: "PhD", value: 5}
          ]
      },
    optional: false
  },

  empStatus: {
    type: String,
    autoform: {
          options: [
            {label: "Full-Time", value: "Full"},
            {label: "Part-Time", value: "Part"},
            {label: "Unemployed", value: "Unemp"},
            {label: "Student", value: "Stu"},
            {label: "Other", value: "Other"},

          ]
      },
    optional: false
  },

  affiliation: {
    type: String,
    label: "Current Affiliation",
    optional: false
  },

  // Time Commitement to Tamerny
  operateTime: {
    type: String,
    autoform: {
          options: [
            {label: "Full-Time", value: "Full"},
            {label: "Part-Time", value: "Part"},
          ]
      },
    optional: false
  },

  langs: {
    type: [String],
    autoform: {
          options: [
            {label: "English", value: "Eng"},
            {label: "Arabic", value: "Arb"},
          ]
      },
    optional: false
  },

  expertise: {
    type: [String],
    autoform: {
          options: [
            {label: "Booking Hotels", value: "Hotels"},
            {label: "Booking Flights", value: "Flights"},
            {label: "Arranging Trips", value: "Trips"},
            {label: "Food Orders", value: "Food"},
            {label: "Social Media", value: "Med"},
            {label: "Sports", value: "Sports"},
            {label: "Events", value: "Events"},
            {label: "News", value: "News"},
          ]
      },
    optional: false
  },

  location: {
    type: String,
    label: "Location",
    autoform: {
          options: [
            {label: "Jeddah", value: "Jeddah"},
            {label: "Mecca", value: "Mecca"},
            {label: "Al-Khobar", value: "Al-Khobar"},
            {label: "Al-Riyadh", value: "Al-Riyadh"},
          ]
      },
    optional: false
  }

});

OperatorProfile.attachSchema(OperatorProfileSchema);

