'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Level2 = require('./Level');

var _Level3 = _interopRequireDefault(_Level2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EasyLevel = function (_Level) {
  _inherits(EasyLevel, _Level);

  function EasyLevel() {
    _classCallCheck(this, EasyLevel);

    var _this = _possibleConstructorReturn(this, (EasyLevel.__proto__ || Object.getPrototypeOf(EasyLevel)).call(this));

    _this.name = 'EasyLevel';
    _this.level = 'easy';
    return _this;
  }

  _createClass(EasyLevel, null, [{
    key: 'getWordScore',
    value: function getWordScore(word, wordInfo, history) {
      // Max 1000
      var score = _get(EasyLevel.__proto__ || Object.getPrototypeOf(EasyLevel), 'getWordScore', this).call(this, word, wordInfo, history);

      if (score > 600 || (wordInfo.start || 0) < 100) {
        return 0;
      }

      if (history.length >= 2) {
        var lastChar = word[word.length - 1];
        score = Math.max(score - history.filter(function (element) {
          return element[element.length - 1] === lastChar;
        }).length * 100, 0);
      }

      return score;
    }
  }]);

  return EasyLevel;
}(_Level3.default);

exports.default = EasyLevel;