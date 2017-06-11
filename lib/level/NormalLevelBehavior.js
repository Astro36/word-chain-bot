const LevelBehavior = require('./LevelBehavior');

class NormalLevelBehavior extends LevelBehavior {
    constructor() {
    	super();
        this.name = 'NormalLevelBehavior';
    }

    getNextWordFrom(words, history) {
        let next = 'gg',
            score = 100000000, // chainable * 1000000 + startsWith
            lastChar = '',
            usedCount = 0;

        if (history.length >= 2) {
            lastChar = history[history.length - 2];
            lastChar = lastChar[lastChar.length - 1];
            usedCount = history.filter(element => {
                return element[element.length - 1] === lastChar;
            });
        }

        for (let word in words) {
            let info = words[word],
                scoreNew = info.chainable * 1000000 + info.startsWith;

            if (word[word.length - 1] === lastChar) {
                scoreNew += 1000000 * usedCount;
            }

            if (history.indexOf(word) < 0 && score > scoreNew && scoreNew > 20000000) {
                next = word;
                score = scoreNew;
            }
        }

        return next;
    }
}

module.exports = NormalLevelBehavior;