const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');
const Level = require('./level/Level');

class WordChainer {
    constructor(dictionary, level) {
        this.dictionary = dictionary;
        this.level = level;
        this.history = [];
    }

    getHistory() {
        return this.history;
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
                    let level = this.level;

                    if (level instanceof Level) {
                        history.push(word);

                        let nextWord = level.getNextWordFrom(dictionary.getNextWords(word), history);
                        history.push(nextWord);

                        if (nextWord === 'gg') {
                            this.history = [];
                        }

                        return nextWord;
                    } else {
                        throw '{level} is not instance of Level';
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