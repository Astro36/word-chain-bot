const fs = require('fs');

const AllowedInitialRule = require('./rule/AllowedInitialRule');
const Rule = require('./rule/Rule');

class Dictionary {
    constructor(path, rules = [new Rule(), new AllowedInitialRule()]) {
        this.dictionaryObj = JSON.parse(fs.readFileSync(path, 'utf8'));
        this.rules = rules;
    }

    getNextWords(word) {
        let dictionary = this.dictionaryObj,
            wordObj = [];
        for (let rule of this.rules) {
            wordObj.push(rule.getValidWords(dictionary, word));
        }
        return Object.assign.call(null, wordObj);
    }

    hasWord(word) {
        let dictionary = this.dictionaryObj;
        for (let rule of this.rules) {
            if (rule.isValidWord(dictionary, word)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Dictionary;