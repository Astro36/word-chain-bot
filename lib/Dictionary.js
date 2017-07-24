'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _DictionaryAnalyzer = require('./DictionaryAnalyzer');

var _DictionaryAnalyzer2 = _interopRequireDefault(_DictionaryAnalyzer);

var _Rule = require('./rule/Rule');

var _Rule2 = _interopRequireDefault(_Rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instances = {};

var Dictionary = function () {
  function Dictionary() {
    var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [_Rule2.default.ALLOWED_INITIAL];

    _classCallCheck(this, Dictionary);

    this.dictionaryObj = new _DictionaryAnalyzer2.default(JSON.parse(_fs2.default.readFileSync(_path2.default.join(__dirname, '../dictionary/koreans_noun.min.json'), 'utf8'))).run(rules);
  }

  _createClass(Dictionary, [{
    key: 'getDictionaryObject',
    value: function getDictionaryObject() {
      return this.dictionaryObj;
    }
  }, {
    key: 'getWordInfo',
    value: function getWordInfo(word) {
      if (word[0] in this.dictionaryObj && word in this.dictionaryObj[word[0]]) {
        return this.dictionaryObj[word[0]][word];
      }
      return -1;
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [_Rule2.default.ALLOWED_INITIAL];

      var key = rules.sort().join('');
      if (key in instances) {
        return instances[key];
      }
      instances[key] = new Dictionary(rules);
      return instances[key];
    }
  }]);

  return Dictionary;
}();

exports.default = Dictionary;