const Level = require('./Level');

class InsaneLevel extends Level {
    constructor() {
        super();
        this.name = 'InsaneLevelBehavior';
        this.level = 'insane';
    }

    getNextWordFrom(words, history) {
        let next = 'gg',
            score = 100000000, // chainable * 1000000 + startsWith
            lastChar = '';

        for (let word in words) {
            let info = words[word],
                scoreNew = info.chainable * 1000000 + info.startsWith;

            if (history.indexOf(word) < 0 && score > scoreNew && scoreNew >= 2000000) {
                next = word;
                score = scoreNew;
            }
        }

        return next;
    }
}

module.exports = InsaneLevel;