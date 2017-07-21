/*
This client side JS file contains the logic for Operator Registration in OpRegStepsLayout.html and OpRegistrationLayout.html

Templates:
  1. OperatorInfo
  2. publishOperator
  3. OperatorRegistForms
  4. StepAdvice
  5. BasicsInfo

*/



// Section I: Import Collections from MondoDB

import { UserProfiles } from '../../collections/userProfiles.js'
window.UserProfiles = UserProfiles



// Section II: onRendered

Template.OperatorInfo.onRendered(function () {
  $('select').material_select();
});



// Section III: Events

Template.OperatorInfo.events({
  'submit': function(){
    event.preventDefault();
    if (AutoForm.validateForm("upsertOperatorForm"))
      FlowRouter.go('/op-registration');
  },
  'click .next':function(){
    event.preventDefault();
    $(".workSettings").css('display', 'block');
    $(".eduEmp").css('display', 'none');
    },
  'click .back':function(){
    event.preventDefault();
    $(".eduEmp").css('display', 'block');
    $(".workSettings").css('display', 'none');
    },
})

Template.BasicsInfo.events({
  'submit': function(){
    event.preventDefault();
    if (AutoForm.validateForm("userUpdateForm"))
      FlowRouter.go('/op-registration');
  }
})

Template.publishOperator.events({
  'click .publish':function(){
    event.preventDefault();
    Meteor.call('addRoll', Meteor.userId(), "operator");
    Meteor.call('insertPairings', Meteor.userId());
    FlowRouter.go('/operatorDashboard/noCustomers');
  },
})

//Section IIII: Helpers

Template.OperatorRegistForms.helpers({
  title(){
    var step = FlowRouter.getParam("step")
    var titles = ["Basic Information", "Education and Employment"]
    return titles[step - 1]
  },
  currentForm(){
    var step = FlowRouter.getParam("step")
    var forms = ["BasicsInfo", "OperatorInfo", "PaymentInfo"]
    return forms[step - 1]
  }
})


Template.StepAdvice.helpers({
  advice (){
    var step = FlowRouter.getParam("step")
    var advice = [
                "Validating your name, phone number, and email ensures that we can contact if there are any new updates in our platform!",
                "Filling in your credentials and expertise helps us pair you with users that you can help the most which increases your ratings!"
                ]
    return (advice[step - 1])
  },
})

Template.BasicsInfo.helpers({
  basicInfo (){
    var info = UserProfiles.findOne({userId: Meteor.userId()});
    return info
  }
})

Template.OperatorInfo.helpers({
  upsert (){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    console.log(info)
    if (info == undefined)
      return "insert"
    else
      return "update"
  },
  updoc(){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    return info
  }
})