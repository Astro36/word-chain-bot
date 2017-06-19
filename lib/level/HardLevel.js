const Level = require('./Level');

class HardLevel extends Level {
    constructor() {
        super();
        this.name = 'HardLevel';
        this.level = 'hard';
    }

    getNextWordFrom(words, history) {
        let next = 'gg',
            score = 100000000, // chainable * 1000000 + startsWith
            lastChar = '';

        for (let word in words) {
            let info = words[word],
                scoreNew = info.chainable * 1000000 + info.startsWith;

            if (history.indexOf(word) < 0 && score > scoreNew && scoreNew > 15000000) {
                next = word;
                score = scoreNew;
            }
        }

        return next;
    }
}

module.exports = HardLevel;