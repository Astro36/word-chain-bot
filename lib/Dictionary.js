'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = void 0;

var Dictionary = function () {
  function Dictionary() {
    _classCallCheck(this, Dictionary);

    this.dictionaryObj = JSON.parse(_fs2.default.readFileSync(_path2.default.join(__dirname, '../dictionary/koreans.min.json'), 'utf8'));
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
      if (!instance) {
        return instance = new Dictionary();
      }
      return instance;
    }
  }]);

  return Dictionary;
}();

exports.default = Dictionary;