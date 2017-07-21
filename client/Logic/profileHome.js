

/*
This client side JS file contains the logic for User/Operato profile which is called Home in HomeLayout.html

Templates:
  1. HomeLayout

*/



// Section I: Importing collections from MongoDB

import { History } from '../../collections/history.js'



// Section II: onRendered

Template.HomeLayout.onRendered(function () {
  $('ul.tabs').tabs();
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
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
  userhistory (){
    var userHistory = History.findOne({userId: Meteor.userId()}).transaction.reverse();
    var transactions = document.getElementById("transaction");
    userHistory.forEach(
      function(transaction) {
        var item = "<li><div class=\"collapsible-header\"><span class=\"left\">"
                 + transaction.title
                 + "</span><span class=\"right\">"
                 + since(transaction.time)
                 + "</span></div><div class=\"collapsible-body\"><span class=\"left\">"
                 + transaction.description
                 + "</span><span class=\"right\">"
                 + transaction.price
                 + "</span><span> ("
                 + transaction.status
                 + ")</span></div></li>";
        transactions.innerHTML = transactions.innerHTML + item;
      }
    )
  }
})




 