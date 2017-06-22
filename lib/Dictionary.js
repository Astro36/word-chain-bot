const fs = require('fs');

class Dictionary {
    constructor(path) {
        this.dictionaryObj = JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    getDictionaryObject() {
        return this.dictionaryObj;
    }
}

module.exports = Dictionary;