const Dictionary = require('./Dictionary');

const LearningAI = require('./ai/LearningAI');

const WordException = require('./exception/WordException');
const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');

const Level = require('./level/Level');
const EasyLevel = require('./level/EasyLevel');
const NormalLevel = require('./level/NormalLevel');
const HardLevel = require('./level/HardLevel');
const InsaneLevel = require('./level/InsaneLevel');

const Rule = require('./rule/Rule');
const AllowedInitialRule = require('./rule/AllowedInitialRule');
const AllowedExtraWordRule = require('./rule/AllowedExtraWordRule');

class WordChainer {
    constructor(level, name = 'test', rules = [new Rule(), new AllowedInitialRule()]) {
        this.dictionary = Dictionary.getInstance();
        this.learning = new LearningAI(name);
        this.level = level;
        this.name = name;
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
                let learning = this.learning,
                    level = this.level,
                    rules = this.rules;
                if (level instanceof Level) {
                    if (learning.getWordWeight(word[0]) > 0) {
                        learning.setWordWeight(word[0], -5);
                    }

                    history.push(word);

                    let wordsInfo = [];

                    for (let i in dictionaryObj) {
                        for (let rule of rules) {
                            if (rule.isValidWord(dictionaryObj, i, history)) {
                                for (let j in dictionaryObj[i]) {
                                    if (this.isValidWord(j)) {
                                        let score = level.getWordScore(j, dictionaryObj[i][j], history);
                                        if (score > 0) {
                                            score += learning.getWordWeight(j);
                                        }
                                        wordsInfo.push([j, score]);
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
                        learning.setWordWeight(word[0], -10);
                        this.history = [];
                        return 'gg';
                    }

                    history.push(nextWordInfo[0]);

                    return nextWordInfo[0];
                } else {
                    throw '{level} is not instance of Level';
                }
            }
        } else if (word === 'gg' && history.length >= 1) {
            this.learning.setWordWeight(history[history.length - 1], 10);
        }
        return null;
    }
}

module.exports = module.exports.WordChainer = WordChainer;
module.exports.Dictionary = Dictionary;

module.exports.LearningAI = LearningAI;

module.exports.WordException = WordException;
module.exports.InvalidWordException = InvalidWordException;
module.exports.NotFoundWordException = NotFoundWordException;
module.exports.UsedWordException = UsedWordException;

module.exports.Level = Level;
module.exports.EasyLevel = EasyLevel;
module.exports.NormalLevel = NormalLevel;
module.exports.HardLevel = HardLevel;
module.exports.InsaneLevel = InsaneLevel;

module.exports.Rule = Rule;
module.exports.AllowedInitialRule = AllowedInitialRule;
module.exports.AllowedExtraWordRule = AllowedExtraWordRule;