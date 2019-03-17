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
    type: String,
    autoform: {
          options: [
            {label: "Primary School", value: "Primary School"},
            {label: "Secondary School", value: "Secondary School"},
            {label: "Undergraduate Degree", value: "Undergraduate Degree"},
            {label: "Graduate Degree", value: "Graduate Degree"},
            {label: "PhD", value: "PhD"}
          ]
      },
    optional: false
  },

  empStatus: {
    type: String,
    autoform: {
          options: [
            {label: "Full-Time", value: "Full-Time"},
            {label: "Part-Time", value: "Part-Time"},
            {label: "Unemployed", value: "Unemployed"},
            {label: "Student", value: "Student"},
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
            {label: "Full-Time", value: "Full-Time"},
            {label: "Part-Time", value: "Part-Time"},
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
            {label: "Social Media", value: "Soc Med"},
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
  },

  payment: {
    type: Boolean,
    label: "Payment Agreement",
    autoform: {
          options: [
            {label: "Agree", value: true},
            {label: "Disagree", value: false},
          ]
      },
    optional: true
  },

  // Active: {
  //   type: Boolean,
  //   label: "Operator Active Status",
  //    autoform: {
  //     type: "hidden"
  //   },
  //   autoValue: function() {
  //     return false
  //   },
  //   optional: true
  // },

    seeking: {
    type: Boolean,
    label: "Operator seeking status",
    optional: false,
       autoform: {
      type: "hidden"
    },
  },

});

OperatorProfile.attachSchema(OperatorProfileSchema);

