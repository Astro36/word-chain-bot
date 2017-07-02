const fs = require('fs');

let instance;

class Dictionary {
    constructor(path) {
        this.dictionaryObj = JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    static getInstance() {
        if (!instance) {
            return instance = new Dictionary('./dictionary/koreans.min.json');
        } else {
            return instance;
        }
    }

    getDictionaryObject() {
        return this.dictionaryObj;
    }
}

module.exports = Dictionary;