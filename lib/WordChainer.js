'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rule = exports.InsaneLevel = exports.HardLevel = exports.NormalLevel = exports.EasyLevel = exports.Level = exports.UsedWordException = exports.NotFoundWordException = exports.InvalidWordException = exports.ForbiddenWordException = exports.WordException = exports.LearningAI = exports.Dictionary = exports.WordChainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dictionary = require('./Dictionary');

var _Dictionary2 = _interopRequireDefault(_Dictionary);

var _LearningAI = require('./ai/LearningAI');

var _LearningAI2 = _interopRequireDefault(_LearningAI);

var _WordException = require('./exception/WordException');

var _WordException2 = _interopRequireDefault(_WordException);

var _ForbiddenWordException = require('./exception/ForbiddenWordException');

var _ForbiddenWordException2 = _interopRequireDefault(_ForbiddenWordException);

var _InvalidWordException = require('./exception/InvalidWordException');

var _InvalidWordException2 = _interopRequireDefault(_InvalidWordException);

var _NotFoundWordException = require('./exception/NotFoundWordException');

var _NotFoundWordException2 = _interopRequireDefault(_NotFoundWordException);

var _UsedWordException = require('./exception/UsedWordException');

var _UsedWordException2 = _interopRequireDefault(_UsedWordException);

var _Level = require('./level/Level');

var _Level2 = _interopRequireDefault(_Level);

var _EasyLevel = require('./level/EasyLevel');

var _EasyLevel2 = _interopRequireDefault(_EasyLevel);

var _NormalLevel = require('./level/NormalLevel');

var _NormalLevel2 = _interopRequireDefault(_NormalLevel);

var _HardLevel = require('./level/HardLevel');

var _HardLevel2 = _interopRequireDefault(_HardLevel);

var _InsaneLevel = require('./level/InsaneLevel');

var _InsaneLevel2 = _interopRequireDefault(_InsaneLevel);

var _Rule = require('./rule/Rule');

var _Rule2 = _interopRequireDefault(_Rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WordChainer = function () {
  function WordChainer(level) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'test';
    var rules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [_Rule2.default.ALLOWED_INITIAL];

    _classCallCheck(this, WordChainer);

    this.dictionary = _Dictionary2.default.getInstance();
    this.learning = new _LearningAI2.default(name);
    this.level = level;
    this.name = name;
    this.rules = rules;
    this.history = [];
  }

  _createClass(WordChainer, [{
    key: 'getHistory',
    value: function getHistory() {
      return this.history;
    }
  }, {
    key: 'isValidWord',
    value: function isValidWord(word) {
      var dictionaryObj = this.dictionary.getDictionaryObject();
      var rules = this.rules;
      var history = this.history;

      // 중복 사용
      if (history.indexOf(word) !== -1) {
        throw new _UsedWordException2.default();
      }

      // 사전
      var startChar = word[0];
      if (startChar in dictionaryObj && word in dictionaryObj[startChar]) {
        // 특수단어
        if (dictionaryObj[startChar][word].theme.filter(function (element) {
          return ['THE iDOLM@STER', 'VOCALOID', '개구리 중사 케로로', '국내 방송 프로그램', '니세코이', '대한민국 철도역', '도타 2', '듀라라라!!', '디지몬', '라면/과자', '러브 라이브!', '리그 오브 레전드', '마법소녀 리리컬 나노하', '마법소녀 마도카☆마기카', '메이플스토리', '메카쿠시티 액터즈', '모노가타리 시리즈', '모바일 게임', '빙과', '사이퍼즈', '스즈미야 하루히', '스타크래프트', '신조어', '아지랑이 프로젝트', '앙상블 스타즈!', '엘소드', '오레이모', '오버워치', '온라인 게임', '외국 영화', '월드 오브 워크래프트', '유루유리', '유명인', '라이트 노벨', '만화/애니메이션', '젤다의 전설', '포켓몬스터', '하이큐!!', '하스스톤', '한국 영화', '함대 컬렉션', '히어로즈 오브 더 스톰'].indexOf(element) !== -1;
        }).length > 0 && !(rules.indexOf(_Rule2.default.ALLOWED_EXTRA) !== -1)) {
          throw new _NotFoundWordException2.default();
        }
        // 매너
        if (dictionaryObj[startChar][word].start <= 5 && rules.indexOf(_Rule2.default.MANNER) !== -1) {
          throw new _ForbiddenWordException2.default();
        }
      } else {
        throw new _NotFoundWordException2.default();
      }

      // 한방단어
      if (history.length === 0 && !(word[word.length - 1] in dictionaryObj)) {
        throw new _InvalidWordException2.default();
      } else if (history.length > 0) {
        // 끝말잇기
        var lastWord = history[history.length - 1];
        if (lastWord[lastWord.length - 1] !== word[0]) {
          // 두음법칙
          if (rules.indexOf(_Rule2.default.ALLOWED_INITIAL) !== -1) {
            var code = lastWord.charCodeAt(lastWord.length - 1) - 44032;
            var final = code % 28;
            var temp = String.fromCharCode(code - final + 44032);

            switch (temp) {
              case '녀':
                temp = '여';
                break;
              case '뇨':
                temp = '요';
                break;
              case '뉴':
                temp = '유';
                break;
              case '니':
                temp = '이';
                break;
              case '랴':
                temp = '야';
                break;
              case '려':
                temp = '여';
                break;
              case '례':
                temp = '예';
                break;
              case '료':
                temp = '요';
                break;
              case '류':
                temp = '유';
                break;
              case '리':
                temp = '이';
                break;
              case '라':
                temp = '나';
                break;
              case '래':
                temp = '내';
                break;
              case '로':
                temp = '노';
                break;
              case '뢰':
                temp = '뇌';
                break;
              case '루':
                temp = '누';
                break;
              case '르':
                temp = '느';
                break;
            }

            if (String.fromCharCode(temp.charCodeAt(0) + final) !== word[0]) {
              throw new _InvalidWordException2.default();
            }
          } else {
            throw new _InvalidWordException2.default();
          }
        }
      }
      return true;
    }
  }, {
    key: 'next',
    value: function next(word) {
      var dictionaryObj = this.dictionary.getDictionaryObject();
      var history = this.history;
      if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
        if (this.isValidWord(word)) {
          var learning = this.learning;
          var level = this.level;
          var rules = this.rules;
          if (learning.getWordWeight(word[0]) > 0) {
            learning.setWordWeight(word[0], -5);
          }

          history.push(word);

          var wordsInfo = [];

          for (var i in dictionaryObj) {
            var check = true;
            // 끝말잇기
            var lastWord = history[history.length - 1];
            if (history.length > 0) {
              if (lastWord[lastWord.length - 1] !== i) {
                // 두음법칙
                if (rules.indexOf(_Rule2.default.ALLOWED_INITIAL) !== -1) {
                  var code = lastWord.charCodeAt(lastWord.length - 1) - 44032;
                  var final = code % 28;
                  var temp = String.fromCharCode(code - final + 44032);

                  switch (temp) {
                    case '녀':
                      temp = '여';
                      break;
                    case '뇨':
                      temp = '요';
                      break;
                    case '뉴':
                      temp = '유';
                      break;
                    case '니':
                      temp = '이';
                      break;
                    case '랴':
                      temp = '야';
                      break;
                    case '려':
                      temp = '여';
                      break;
                    case '례':
                      temp = '예';
                      break;
                    case '료':
                      temp = '요';
                      break;
                    case '류':
                      temp = '유';
                      break;
                    case '리':
                      temp = '이';
                      break;
                    case '라':
                      temp = '나';
                      break;
                    case '래':
                      temp = '내';
                      break;
                    case '로':
                      temp = '노';
                      break;
                    case '뢰':
                      temp = '뇌';
                      break;
                    case '루':
                      temp = '누';
                      break;
                    case '르':
                      temp = '느';
                      break;
                  }

                  if (String.fromCharCode(temp.charCodeAt(0) + final) !== i) {
                    check = false;
                  }
                } else {
                  check = false;
                }
              }
            }

            if (check) {
              for (var j in dictionaryObj[i]) {
                try {
                  if (this.isValidWord(j)) {
                    var score = level.getWordScore(j, dictionaryObj[i][j], history);
                    if (score > 0) {
                      score += learning.getWordWeight(j);
                    }
                    wordsInfo.push([j, score]);
                  }
                } catch (e) {}
              }
            }
          }

          wordsInfo.sort(function (a, b) {
            var c = b[1] - a[1];
            if (c === 0) {
              return Math.random() * 10 - 5;
            }
            return c;
          });

          var nextWordInfo = wordsInfo[0];

          if (wordsInfo.length === 0 || nextWordInfo[1] === 0) {
            if (history.length >= 2) {
              var _lastWord = history[history.length - 2];
              learning.setWordWeight(_lastWord[_lastWord.length - 1], -10);
            }
            this.history = [];
            return 'gg';
          }

          history.push(nextWordInfo[0]);

          return nextWordInfo[0];
        }
      } else if (word.toLowerCase() === 'gg' && history.length >= 1) {
        this.learning.setWordWeight(history[history.length - 1], 10);
      }
      return null;
    }
  }]);

  return WordChainer;
}();

exports.default = WordChainer;
exports.WordChainer = WordChainer;
exports.Dictionary = _Dictionary2.default;
exports.LearningAI = _LearningAI2.default;
exports.WordException = _WordException2.default;
exports.ForbiddenWordException = _ForbiddenWordException2.default;
exports.InvalidWordException = _InvalidWordException2.default;
exports.NotFoundWordException = _NotFoundWordException2.default;
exports.UsedWordException = _UsedWordException2.default;
exports.Level = _Level2.default;
exports.EasyLevel = _EasyLevel2.default;
exports.NormalLevel = _NormalLevel2.default;
exports.HardLevel = _HardLevel2.default;
exports.InsaneLevel = _InsaneLevel2.default;
exports.Rule = _Rule2.default;