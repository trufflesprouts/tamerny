var landingMap = document.getElementById('landing-map');
var dist = 300;
var mapAnimationStarted = false;


landingMap.addEventListener("load",function(){
    var svgDoc = landingMap.contentDocument;
    var svgLines = svgDoc.getElementById("lines");

    window.onscroll = function() {
      if (!mapAnimationStarted) {
        var landingMapVisiable = checkVisible(landingMap, dist);

        if (landingMapVisiable) {
          mapAnimationStarted = true;
          svgLines.classList.add('animateMap');
        }
      }
    };
}, false);

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

  return mode === 'above' ? above : mode === 'below' ? below : !above && !below;
}
