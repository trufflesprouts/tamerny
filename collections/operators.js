import { Mongo } from 'meteor/mongo';

export const Operators = new Mongo.Collection('operators');

OperatorsSchema = new SimpleSchema({
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
});

Operators.attachSchema(OperatorsSchema);

