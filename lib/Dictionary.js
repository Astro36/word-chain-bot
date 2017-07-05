const fs = require('fs');
const path = require('path');

let instance;

class Dictionary {
    constructor() {
        this.dictionaryObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../dictionary/koreans.min.json'), 'utf8'));
    }

    static getInstance() {
        if (!instance) {
            return instance = new Dictionary();
        } else {
            return instance;
        }
    }

    getDictionaryObject() {
        return this.dictionaryObj;
    }
}

module.exports = Dictionary;