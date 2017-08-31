/*
This client side JS file contains the logic for the home page which is called HomeLayout in HomeLayout.html

Templates:
  1. HomeLayout

*/

import Typed from 'typed.js';

Template.HomeLayout.onRendered(function() {
  $(document).ready(function() {
    $('.modal').modal();

    var words = ['Assistant', 'Driver', 'Pilot', 'Chef', 'Friend', 'Concierge'];

    var typedOptions = {
      strings: words,
      showCursor: false,
      shuffle: true,
      loop: true,
      typeSpeed: 150,
      backSpeed: 150,
      backDelay: 2700
    };

    var typed = new Typed('#is-word', typedOptions);

    var landingMap = document.getElementById('landing-map');
    var mapAnimationStarted = false;

    landingMap.addEventListener(
      'load',
      function() {
        var svgDoc = landingMap.contentDocument;
        var svgLines = svgDoc.getElementById('lines');

        window.onscroll = function() {
          if (!mapAnimationStarted) {
            var landingMapVisiable = checkVisible(landingMap);

            if (landingMapVisiable) {
              mapAnimationStarted = true;
              svgLines.classList.add('animateMap');
            }
          }
        };
      },
      false
    );

    function checkVisible(elm, threshold, mode) {
      threshold = threshold || 0;
      mode = mode || 'visible';

      var rect = elm.getBoundingClientRect();
      var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );
      var above = rect.bottom - threshold < 0;
      var below = rect.top - viewHeight + threshold >= 0;

      return mode === 'above'
        ? above
        : mode === 'below' ? below : !above && !below;
    }
  });
});
