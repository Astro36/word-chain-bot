const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');
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
            checks = [false, false, false],
            history = this.history;
        for (let rule of this.rules) {
            if (!checks[0] && rule.isAvailableWord(dictionaryObj, word, history)) {
                checks[0] = true;
            }
            if (!checks[1] && rule.isExistedWord(dictionaryObj, word, history)) {
                checks[1] = true;
            }
            if (!checks[2] && rule.isValidWord(dictionaryObj, word, history)) {
                checks[2] = true;
            }
        }
        return checks[0] && checks[1] && checks[2];
    }

    isValidWordWithExceptions(word) {
        let dictionaryObj = this.dictionary.getDictionaryObject(),
            checks = [false, false, false],
            history = this.history;
        for (let rule of this.rules) {
            if (!checks[0] && rule.isAvailableWord(dictionaryObj, word, history)) {
                checks[0] = true;
            }
            if (!checks[1] && rule.isExistedWord(dictionaryObj, word, history)) {
                checks[1] = true;
            }
            if (!checks[2] && rule.isValidWord(dictionaryObj, word, history)) {
                checks[2] = true;
            }
        }

        if (!checks[0]) {
            throw new UsedWordException();
        } else if (!checks[1]) {
            throw new NotFoundWordException();
        } else if (!checks[2]) {
            throw new InvalidWordException();
        }
        return true;
    }

    next(word) {
        let dictionaryObj = this.dictionary.getDictionaryObject(),
            history = this.history;
        if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
            if (this.isValidWordWithExceptions(word)) {
                let level = this.level,
                    rules = this.rules;
                if (level instanceof Level) {
                    history.push(word);

                    let wordsInfo = [];

                    for (let i in dictionaryObj) {
                        for (let rule of rules) {
                            if (rule.isValidWord(dictionaryObj, i, history)) {
                                for (let j in dictionaryObj[i]) {
                                    if (this.isValidWord(j)) {
                                        wordsInfo.push([j, level.getWordScore(j, dictionaryObj[i][j], history)]);
                                    }
                                }
                                break;
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
        }
        return null;
    }
}

module.exports = WordChainer;