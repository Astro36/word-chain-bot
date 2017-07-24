'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Rule = require('./rule/Rule');

var _Rule2 = _interopRequireDefault(_Rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DictionaryAnalyzer = function () {
  function DictionaryAnalyzer(dictionaryObj) {
    _classCallCheck(this, DictionaryAnalyzer);

    this.dictionaryObj = dictionaryObj;
  }

  _createClass(DictionaryAnalyzer, [{
    key: 'run',
    value: function run() {
      var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [_Rule2.default.ALLOWED_INITIAL];

      if (this.dictionaryObj) {
        var _getChain = function _getChain(word, chain) {
          var startChar = word[0];
          chain++;
          chains[startChar] = chain;
          if (chain < 21) {
            for (var i in dictionaryObjLast[startChar]) {
              var word2 = dictionaryObjLast[startChar][i];
              if (!(word2[0] in chains)) {
                _getChain(word2, chain);
              }
            }
          }
        };

        var dictionaryObj = this.dictionaryObj;
        var dictionaryObjLast = {}; // 끝 단어로 묶은 객체
        var dangerWords = []; // 한방단어
        var starts = {};
        var chains = {};

        for (var startChar in dictionaryObj) {
          var size = Object.keys(dictionaryObj[startChar]).length;
          if (size === 0) {
            delete dictionaryObj[startChar];
          } else {
            for (var word in dictionaryObj[startChar]) {
              var lastChar = word[word.length - 1];
              if (!(lastChar in dictionaryObj)) {
                dangerWords.push(word);
              }
              if (!(lastChar in dictionaryObjLast)) {
                dictionaryObjLast[lastChar] = [];
              }
              dictionaryObjLast[lastChar].push(word);
            }
            starts[startChar] = size;
          }
        }

        for (var i in dangerWords) {
          var _word = dangerWords[i];
          var _lastChar = _word[_word.length - 1];
          chains[_lastChar] = 1;
          _getChain(_word, 1);
        }

        if (rules.indexOf(_Rule2.default.ALLOWED_INITIAL) !== -1) {
          for (var _startChar in chains) {
            var char = _Utils2.default.convertInitialSound(_startChar);
            if (char !== _startChar && char in chains) {
              chains[_startChar] = Math.max(chains[char], chains[_startChar]);
            }
          }
        }

        for (var _startChar2 in dictionaryObj) {
          for (var _word2 in dictionaryObj[_startChar2]) {
            var _lastChar2 = _word2[_word2.length - 1];
            dictionaryObj[_startChar2][_word2].start = starts[_lastChar2];
            dictionaryObj[_startChar2][_word2].chain = chains[_lastChar2];
          }
        }

        return dictionaryObj;
      }
      return null;
    }
  }]);

  return DictionaryAnalyzer;
}();

exports.default = DictionaryAnalyzer;