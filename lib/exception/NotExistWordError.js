const WordError = require('./WordError');

class NotExistWordError extends WordError {
  constructor() {
    super('NotExistWordError', '사전에 없는 단어입니다.');
  }
}

module.exports = NotExistWordError;
