class Rule {
    constructor() {
        this.name = 'Rule';
    }

    isAvailableWord(dictionaryObj, word, history) {
        if (history.indexOf(word) < 0) {
            return true;
        } else {
            return false;
        }
    }

    isExistedWord(dictionaryObj, word, history) {
        let startChar = word[0];
        if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
            return dictionaryObj[startChar][word].extra.length === 0;
        } else {
            return false;
        }
    }

    isValidWord(dictionaryObj, word, history) {
        let lastWord = history[history.length - 1];
        if (history.length === 0) {
            return word[word.length - 1] in dictionaryObj;
        } else if (history.length > 0) {
            return lastWord[lastWord.length - 1] === word[0];
        } else {
            return false;
        }
    }
}

module.exports = Rule;