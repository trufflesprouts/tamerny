

/*
This client side JS file contains the logic for the Navbar in Navbar.html

Templates:
  1. Navbar
  2. navbarAccount

*/



// SECTION I: onRendered

Template.Navbar.onRendered(function () {
  $(document).ready(function(){
    $('.modal').modal();
    $('ul.tabs').tabs();
  });
});

Template.navbarAccount.onRendered(function () {
  $(document).ready(function(){
    $(".dropdown-button").dropdown({});
  });
});



// Section II: Events

Template.navbarAccount.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
      FlowRouter.go('/');
    }
  });

Template.Navbar.events({
  'click .open-modal': function(event) {
    event.preventDefault();
    console.log("open modal")
    FlowRouter.go('/op-registration');
    $('#login').modal('open');
  },
});



//Section II: Helpers

Template.Navbar.helpers({
  loginstate(state){
    if (state == "login"){
      return true;
    }else {
      return false;
    }
  },
  notOperator(){
    var user = UserProfiles.findOne({userId: Meteor.userId()});
    var numberRoles = user.roles.length
    var roles = user.roles

    var state = true
    for (i = 0; i < numberRoles; i++) {
      if (roles[i] == "operator")
        state = false
    }

    return state

  },
  dashboardLink(){
    var doc = Pairings.findOne({operatorId: Meteor.userId()})
    var size = Object.keys(doc).length;

    if (size > 2){
      if (doc.userIds.length != 0)
        var link = '/operatorDashboard/' + doc.userIds[0]
      else
        var link = '/operatorDashboard/noCustomers'
      return link
    } else {
      return '/operatorDashboard/noCustomers'
    }
  }
});

Template.navbarAccount.helpers({
  name (){
    var doc = UserProfiles.findOne({userId: Meteor.userId()});
    return doc.firstName
  }
})
