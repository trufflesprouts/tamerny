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

var isWord = document.getElementById('is-word');
words = [
  'Assistant',
  'Driver',
  'Pilot',
  'Chef',
  'Friend',
  'Concierge',
]

typeWords(words);

function typeWords(words) {
  state = {
    interval: 0
  }

  typeCurrentWord();

  function typeCurrentWord() {
    if (state.interval === words.length) {
      state.interval = 0;
    }
    currentWord = words[state.interval];
    typeWord(currentWord, isWord, deleteWord);
  }

  function typeWord(word, elm, cb) {
    var i = 0;
    var wordFragment = '';
    function wl(word) {
      wordFragment += word[i];
      isWord.textContent = wordFragment;
      setTimeout(function () {
        if (i < word.length - 1) {
          i++;
          wl(word);
        } else {
          setTimeout(function () {
            cb(word, elm);
          }, 4000);
        }
      }, 200);
    }
    wl(word);
  }

  function deleteWord(word, elm) {
    var i = word.length - 1;
    var wordFragment = word;
    function wl(word) {
      wordFragment = wordFragment.slice(0,-1);
      isWord.textContent = wordFragment;
      setTimeout(function () {
        if (i >= 0) {
          i--;
          wl(word);
        } else {
          state.interval += 1;
          typeCurrentWord();
        }
      }, 200);
    }
    wl(word);
  }
}


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
