'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WordException2 = require('./WordException');

var _WordException3 = _interopRequireDefault(_WordException2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UsedWordException = function (_WordException) {
  _inherits(UsedWordException, _WordException);

  function UsedWordException() {
    _classCallCheck(this, UsedWordException);

    var _this = _possibleConstructorReturn(this, (UsedWordException.__proto__ || Object.getPrototypeOf(UsedWordException)).call(this));

    _this.name = 'UsedWordException';
    _this.message = 'The word is already used. Try another word!';
    return _this;
  }

  return UsedWordException;
}(_WordException3.default);

exports.default = UsedWordException;