
/*
This client side JS file contains the logic for anything we are testing in TestLayout.html

Templates:
  1. TestLayout

*/



// Section I: onRendered

Template.TestLayout.onRendered(function () {
  $( document ).ready(function(){
    $(".dropdown-button").dropdown({});
  })
});



// Section II: Helpers

Template.TestLayout.helpers({
  operatorInfo (){
    var info = OperatorProfile.findOne({userId: Meteor.userId()});
    return info
  },
})