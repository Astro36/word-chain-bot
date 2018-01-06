const WordError = require('./WordError');

class TooShortWordError extends WordError {
  constructor() {
    super('TooShortWordError', '너무 짧은 단어입니다. 2글자 이상의 단어를 입력해주세요.');
  }
}

module.exports = TooShortWordError;
