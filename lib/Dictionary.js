const fs = require('fs');

class Dictionary {
    constructor(path, rule) {
        this.dictionaryObj = JSON.parse(fs.readFileSync(path, 'utf8'));
        this.rule = rule;
    }

    getNextWords(word) {
        let dictionary = this.dictionaryObj,
            lastChar = word[word.length - 1];
        if (lastChar in dictionary) {
            return dictionary[lastChar];
        }
        return {};
    }

    hasWord(word) {
        let dictionary = this.dictionaryObj,
            startChar = word[0];
        if (startChar in dictionary) {
            return word in dictionary[startChar];
        }
        return false;
    }
}

module.exports = Dictionary;