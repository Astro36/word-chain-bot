const WordException = require('./WordException');

class UsedWordException extends WordException {
    constructor() {
        super();
        this.name = 'UsedWordException';
        this.message = 'The word is already used. Try another word!';
    }
}

module.exports = UsedWordException;