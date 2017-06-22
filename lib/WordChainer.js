const Level = require('./level/Level');
const AllowedInitialRule = require('./rule/AllowedInitialRule');
const Rule = require('./rule/Rule');

class WordChainer {
    constructor(dictionary, level, rules = [new Rule(), new AllowedInitialRule()]) {
        this.dictionary = dictionary;
        this.level = level;
        this.rules = rules;
        this.history = [];
    }

    getHistory() {
        return this.history;
    }

    isValidWord(word) {
        let dictionaryObj = this.dictionary.getDictionaryObject(),
            history = this.history;
        for (let rule of this.rules) {
            if (rule.isValidWord(dictionaryObj, word, history)) {
                return true;
            }
        }
        return false;
    }

    next(word) {
        let dictionaryObj = this.dictionary.getDictionaryObject(),
            history = this.history;
        if (this.isValidWord(word)) {
            let level = this.level;
            if (level instanceof Level) {
                history.push(word);

                let wordsInfo = [];

                for (let i in dictionaryObj) {
                    for (let j in dictionaryObj[i]) {
                        if (this.isValidWord(j)) {
                            wordsInfo.push([j, level.getWordScore(dictionaryObj[i][j], history)]);
                        }
                    }
                }

                wordsInfo.sort((a, b) => {
                    let c = b[1] - a[1];
                    if (c === 0) {
                        return Math.random() * 10 - 5;
                    }
                    return c;
                });

                let nextWordInfo = wordsInfo[0];

                if (wordsInfo.length === 0 || nextWordInfo[1] === 0) {
                    this.history = [];
                    return 'gg';
                }

                history.push(nextWordInfo[0]);

                return nextWordInfo[0];
            } else {
                throw '{level} is not instance of Level';
            }
        }
        return null;
    }
}

module.exports = WordChainer;