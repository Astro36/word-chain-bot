class UsedWordException {
    constructor() {
        this.name = 'UsedWordException';
    }

    toString() {
        return 'UsedWordException: The word is already used. Try another word!';
    }
}

module.exports = UsedWordException;