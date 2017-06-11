class InvalidWordException {
    constructor() {
        this.name = 'InvalidWordException';
    }

    toString() {
        return 'InvalidWordException: The word is invalid. Try another word!';
    }
}

module.exports = InvalidWordException;