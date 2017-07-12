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

var LearningAI = function () {
  function LearningAI() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test';

    _classCallCheck(this, LearningAI);

    this.path = _path2.default.join(__dirname, '../../data/learnings-' + name + '.json');
    if (_fs2.default.existsSync(this.path)) {
      this.learningObj = JSON.parse(_fs2.default.readFileSync(this.path, 'utf8'));
    } else {
      var dirPath = _path2.default.join(this.path, '../');
      if (!_fs2.default.existsSync(dirPath)) {
        _fs2.default.mkdirSync(dirPath);
      }
      this.learningObj = {};
    }
  }

  _createClass(LearningAI, [{
    key: 'getLearningObject',
    value: function getLearningObject() {
      return this.learningObj;
    }
  }, {
    key: 'getWordWeight',
    value: function getWordWeight(word) {
      var lastChar = word[word.length - 1];
      if (lastChar in this.learningObj) {
        return this.learningObj[lastChar];
      }
      return 0;
    }
  }, {
    key: 'hasWord',
    value: function hasWord(word) {
      return word in this.learningObj;
    }
  }, {
    key: 'setWordWeight',
    value: function setWordWeight(word, weight) {
      var lastChar = word[word.length - 1];
      if (!(lastChar in this.learningObj)) {
        this.learningObj[lastChar] = 0;
      }
      this.learningObj[lastChar] += weight;

      if (this.learningObj[lastChar] > 50) {
        this.learningObj[lastChar] = 50;
      } else if (this.learningObj[lastChar] < -50) {
        this.learningObj[lastChar] = -50;
      }

      if (this.learningObj[word] === 0) {
        delete this.learningObj[word];
      }
      _fs2.default.writeFileSync(this.path, JSON.stringify(this.learningObj));
    }
  }]);

  return LearningAI;
}();

exports.default = LearningAI;