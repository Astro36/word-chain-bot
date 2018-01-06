const WordError = require('./WordError');

class AlreadyUsedWordError extends WordError {
  constructor() {
    super('AlreadyUsedWordError', '이미 사용한 단어입니다.');
  }
}

module.exports = AlreadyUsedWordError;
