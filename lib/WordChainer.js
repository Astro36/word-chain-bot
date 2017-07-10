const Dictionary = require('./Dictionary');

const LearningAI = require('./ai/LearningAI');

const WordException = require('./exception/WordException');
const ForbiddenWordException = require('./exception/ForbiddenWordException');
const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');

const Level = require('./level/Level');
const EasyLevel = require('./level/EasyLevel');
const NormalLevel = require('./level/NormalLevel');
const HardLevel = require('./level/HardLevel');
const InsaneLevel = require('./level/InsaneLevel');

const Rule = require('./rule/Rule');

class WordChainer {
    constructor(level, name = 'test', rules = [Rule.ALLOWED_INITIAL]) {
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
            rules = this.rules,
            history = this.history;

        // 중복 사용
        if (history.indexOf(word) >= 0) {
            throw new UsedWordException();
        }

        // 사전
        let startChar = word[0];
        if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
            // 특수단어
            if (dictionaryObj[startChar][word].extra.length > 0 && rules.indexOf(Rule.ALLOWED_EXTRA) < 0) {
                throw new NotFoundWordException();
            }
            // 매너
            if (dictionaryObj[startChar][word].start <= 5 && rules.indexOf(Rule.MANNER) >= 0) {
                throw new ForbiddenWordException();
            }
        } else {
            new NotFoundWordException();
        }

        // 끝말잇기
        if (history.length > 0) {
            let lastWord = history[history.length - 1];
            if (lastWord[lastWord.length - 1] !== word[0]) {
                // 두음법칙
                if (rules.indexOf(Rule.ALLOWED_INITIAL) >= 0) {
                    let code = lastWord.charCodeAt(lastWord.length - 1) - 44032,
                        final = code % 28,
                        temp = String.fromCharCode(~~(code / 28) * 28 + 44032);
                    switch (temp) {
                    case "녀":
                        temp = "여";
                        break;
                    case "뇨":
                        temp = "요";
                        break;
                    case "뉴":
                        temp = "유";
                        break;
                    case "니":
                        temp = "이";
                        break;
                    case "랴":
                        temp = "야";
                        break;
                    case "려":
                        temp = "여";
                        break;
                    case "례":
                        temp = "예";
                        break;
                    case "료":
                        temp = "요";
                        break;
                    case "류":
                        temp = "유";
                        break;
                    case "리":
                        temp = "이";
                        break;
                    case "라":
                        temp = "나";
                        break;
                    case "래":
                        temp = "내";
                        break;
                    case "로":
                        temp = "노";
                        break;
                    case "뢰":
                        temp = "뇌";
                        break;
                    case "루":
                        temp = "누";
                        break;
                    case "르":
                        temp = "느";
                        break;
                    }

                    if (String.fromCharCode(temp.charCodeAt(0) + final) !== word[0]) {
                        throw new InvalidWordException();
                    }
                } else {
                    throw new InvalidWordException();
                }
            }
        }
        return true;
    }

    next(word) {
        let dictionaryObj = this.dictionary.getDictionaryObject(),
            history = this.history;
        if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
            if (this.isValidWord(word)) {
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
                        let check = true;
                        // 끝말잇기
                        let lastWord = history[history.length - 1];
                        if (history.length > 0) {
                            if (lastWord[lastWord.length - 1] !== i) {
                                // 두음법칙
                                if (rules.indexOf(Rule.ALLOWED_INITIAL) >= 0) {
                                    let code = lastWord.charCodeAt(lastWord.length - 1) - 44032,
                                        final = code % 28,
                                        temp = String.fromCharCode(~~(code / 28) * 28 + 44032);
                                    switch (temp) {
                                    case "녀":
                                        temp = "여";
                                        break;
                                    case "뇨":
                                        temp = "요";
                                        break;
                                    case "뉴":
                                        temp = "유";
                                        break;
                                    case "니":
                                        temp = "이";
                                        break;
                                    case "랴":
                                        temp = "야";
                                        break;
                                    case "려":
                                        temp = "여";
                                        break;
                                    case "례":
                                        temp = "예";
                                        break;
                                    case "료":
                                        temp = "요";
                                        break;
                                    case "류":
                                        temp = "유";
                                        break;
                                    case "리":
                                        temp = "이";
                                        break;
                                    case "라":
                                        temp = "나";
                                        break;
                                    case "래":
                                        temp = "내";
                                        break;
                                    case "로":
                                        temp = "노";
                                        break;
                                    case "뢰":
                                        temp = "뇌";
                                        break;
                                    case "루":
                                        temp = "누";
                                        break;
                                    case "르":
                                        temp = "느";
                                        break;
                                    }

                                    if (String.fromCharCode(temp.charCodeAt(0) + final) !== i) {
                                        check = false;
                                    }
                                } else {
                                    check = false;
                                }
                            }
                        }

                        if (check) {
                            for (let j in dictionaryObj[i]) {
                                try {
                                    if (this.isValidWord(j)) {
                                        let score = level.getWordScore(j, dictionaryObj[i][j], history);
                                        if (score > 0) {
                                            score += learning.getWordWeight(j);
                                        }
                                        wordsInfo.push([j, score]);
                                    }
                                } catch (e) {}
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
module.exports.ForbiddenWordException = ForbiddenWordException;
module.exports.InvalidWordException = InvalidWordException;
module.exports.NotFoundWordException = NotFoundWordException;
module.exports.UsedWordException = UsedWordException;

module.exports.Level = Level;
module.exports.EasyLevel = EasyLevel;
module.exports.NormalLevel = NormalLevel;
module.exports.HardLevel = HardLevel;
module.exports.InsaneLevel = InsaneLevel;

module.exports.Rule = Rule;