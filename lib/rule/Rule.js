const InvalidWordException = require('../exception/InvalidWordException');
const NotFoundWordException = require('../exception/NotFoundWordException');
const UsedWordException = require('../exception/UsedWordException');

class Rule {
    constructor() {
        this.name = 'Rule';
    }

    isValidWord(dictionaryObj, word, history) {
        if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
            let startChar = word[0];
            if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
                let lastWord = history[history.length - 1];
                if (history.length === 0 || (history.length > 0 && lastWord[lastWord.length - 1] === word[0])) {
                    if (history.indexOf(word) < 0) {
                        return true;
                    } else {
                        //throw new UsedWordException();
                    }
                } else {
                    //throw new InvalidWordException();
                }
            } else {
                //throw new NotFoundWordException();
            }
        }
        return false;
    }
}

module.exports = Rule;