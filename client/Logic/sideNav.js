/*
This client side JS file contains the logic for the Side Nav in SideNav.html

Templates:
  1. SideNav

*/

// SECTION I: onRendered

Template.SideNav.onRendered(function() {
  $(document).ready(function() {
    $('.button-collapse').sideNav({
      menuWidth: 250, // Default is 300
      closeOnClick: true,
    });
  });
});

// Section II: Events

Template.SideNav.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout(function() {
      FlowRouter.go('/');
    });
  },
});

//Section II: Helpers

Template.SideNav.helpers({
  basicUserInfo() {
    var info = UserProfiles.findOne({ userId: Meteor.userId() });
    return info;
  },
  loginstate(state) {
    if (state == 'login') {
      return true;
    } else {
      return false;
    }
  },
  notOperator() {
    var user = UserProfiles.findOne({ userId: Meteor.userId() });
    var numberRoles = user.roles.length;
    var roles = user.roles;

    var state = true;
    for (i = 0; i < numberRoles; i++) {
      if (roles[i] == 'operator') state = false;
    }

    return state;
  },
  isOperator() {
    var userProfileDoc = UserProfiles.findOne({ userId: Meteor.userId() });
    var roles = userProfileDoc.roles;
    var rolesLength = roles.length;
    var status = false;

    for (var i = 0; i < rolesLength; i++) {
      if (roles[i] == 'operator') status = true;
    }
    return status;
  },
  dashboardLink() {
    var doc = Pairings.findOne({ operatorId: Meteor.userId() });
    var size = Object.keys(doc).length;

    if (size > 2) {
      if (doc.userIds.length != 0)
        var link = '/operatorDashboard/' + doc.userIds[0];
      else var link = '/operatorDashboard/noCustomers';
      return link;
    } else {
      return '/operatorDashboard/noCustomers';
    }
  },
});
