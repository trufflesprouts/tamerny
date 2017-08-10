

/*
This client side JS file contains the logic for User/Operato profile which is called Home in HomeLayout.html

Templates:
  1. HomeLayout

*/



// Section I: Importing collections from MongoDB

import { History } from '../../collections/history.js'



// Section II: onRendered

Template.transactions.onRendered(function () {
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    $('.modal').modal();
  });
})

Template.HomeLayout.onRendered(function () {
  $('#3dsecurity').load(function (){
    console.log(document.getElementById('3dsecurity').src)
  })
})

// Section III: Events

Template.HomeLayout.events({
  'submit form': function(event) {
    event.preventDefault();
  }
});



// Section IIII: Helpers

Template.HomeLayout.helpers({
  balance(){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    return userProfileDoc.balance;
  },
  userHistory (){
    var userHistory = History.findOne({userId: Meteor.userId()}).transactions.reverse();
    return userHistory
  }
})

Template.transactions.helpers({
  since (then){
    var then = then.getTime();
    var now = (new Date()).getTime();

    diff = now - then;
    if (diff/1000 < 1) {
      var difference = "Now"
    } else if (diff/(1000*60) < 1) {
      var difference = parseInt(diff/(1000)) + "s"
    } else if (diff/(1000*60*60) < 1) {
      var difference = parseInt(diff/(1000*60)) + "min"
    } else if (diff/(1000*60*60*24) < 1) {
      var difference = parseInt(diff/(1000*60*60)) + "h"
    } else if (diff/(1000*60*60*24*30) < 1) {
      var difference = parseInt(diff/(1000*60*60*24)) + "d"
    } else if (diff/(1000*60*60*24*365) < 1) {
      var difference = parseInt(diff/(1000*60*60*24*30)) + "m"
    } else {
      var difference = parseInt(diff/(1000*60*60*24*365)) + "y"
    }
    return difference
  }
})

window.callbackHandler = function (callback_url){
  console.log(callback_url)
  // var pos = callback_url.locate("http://localhost:3000/");
  // if ( pos == 0 ){
  //   $("3dsecurity_frame").modal("close");
  // }
}
