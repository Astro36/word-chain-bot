'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Level = function () {
  function Level() {
    _classCallCheck(this, Level);

    this.name = 'Level';
  }

  _createClass(Level, null, [{
    key: 'getWordScore',
    value: function getWordScore(word, wordInfo, history) {
      // Max 1000
      var score = 800;

      if (wordInfo.chain % 2 === 1) {
        score += 200 - (wordInfo.chain - 1) * 10;
      } else {
        score -= 220 - wordInfo.chain * 10;
      }

      score = Math.max(score - Math.floor((wordInfo.start || 0) / 100), 0);

      if (history.length === 1 && wordInfo.chain === 1) {
        return 0;
      }

      return score;
    }
  }]);

  return Level;
}();

exports.default = Level;