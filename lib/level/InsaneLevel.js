'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Level2 = require('./Level');

var _Level3 = _interopRequireDefault(_Level2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InsaneLevel = function (_Level) {
  _inherits(InsaneLevel, _Level);

  function InsaneLevel() {
    _classCallCheck(this, InsaneLevel);

    var _this = _possibleConstructorReturn(this, (InsaneLevel.__proto__ || Object.getPrototypeOf(InsaneLevel)).call(this));

    _this.name = 'InsaneLevelBehavior';
    _this.level = 'insane';
    return _this;
  }

  return InsaneLevel;
}(_Level3.default);

exports.default = InsaneLevel;