

/*
This client side JS file contains the logic for the Navbar in Navbar.html

Templates:
  1. Navbar

*/



// SECTION I: onRendered

Template.Navbar.onRendered(function () {
  $(document).ready(function(){
    $('.modal').modal();
    $('ul.tabs').tabs();
    $(".button-collapse").sideNav();
  });
});

// Section II: Events

Template.Navbar.events({
  'click .side': function(){
    $('.button-collapse').sideNav('hide');
  }
});
