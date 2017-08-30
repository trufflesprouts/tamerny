/*
This client side JS file contains the logic for the home page which is called HomeLayout in HomeLayout.html

Templates:
  1. HomeLayout

*/

import Typed from 'typed.js';

Template.HomeLayout.onRendered(function () {
  $(document).ready(function(){
    $('.modal').modal();

    var words = [
      'Assistant',
      'Driver',
      'Pilot',
      'Chef',
      'Friend',
      'Concierge',
    ]

    var typedOptions = {
      strings: words,
      showCursor: false,
      typeSpeed: 150,
      backSpeed: 150,
      backDelay: 2700
    }

    var typed = new Typed("#is-word", typedOptions);
  });
});
