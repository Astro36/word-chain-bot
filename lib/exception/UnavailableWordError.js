const WordError = require('./WordError');

class UnavailableWordError extends WordError {
  constructor() {
    super('UnavailableWordError', '다음 단어로 사용할 수 없는 단어입니다.');
  }
}

module.exports = UnavailableWordError;
