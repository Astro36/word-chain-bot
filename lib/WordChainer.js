const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');
const LevelBehavior = require('./level/LevelBehavior');

class WordChainer {
    constructor(dictionary, levelBehavior) {
        this.dictionary = dictionary;
        this.levelBehavior = levelBehavior;
        this.history = [];
    }

    next(word) {
        let dictionary = this.dictionary,
            history = this.history;

        if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
            if (dictionary.hasWord(word)) {
                let lastWord = history[history.length - 1];

                if (history.length > 0 && lastWord[lastWord.length - 1] !== word[0]) {
                    throw new InvalidWordException();
                }

                if (history.indexOf(word) < 0) {
                    let levelBehavior = this.levelBehavior;

                    if (levelBehavior instanceof LevelBehavior) {
                        history.push(word);

                        let nextWord = levelBehavior.getNextWordFrom(dictionary.getNextWords(word), history);
                        history.push(nextWord);

                        if (nextWord === 'gg') {
                            this.history = [];
                        }

                        return nextWord;
                    } else {
                        throw 'levelBehavior is not instance of LevelBehavior';
                    }
                } else {
                    throw new UsedWordException();
                }
            } else {
                throw new NotFoundWordException();
            }
        } else {
            return null;
        }
    }
}

module.exports = WordChainer;