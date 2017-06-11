class NotFoundWordException {
    constructor() {
        this.name = 'NotFoundWordException';
    }

    toString() {
        return 'NotFoundWordException: Cannot find the word in the dictionary. Try another word!';
    }
}

module.exports = NotFoundWordException;