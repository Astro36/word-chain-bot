const WordException = require('./WordException');

class ForbiddenWordException extends WordException {
  constructor() {
    super();
    this.name = 'ForbiddenWordException';
    this.message = 'This word is forbidden. Try another word!';
  }
}

module.exports = ForbiddenWordException;
