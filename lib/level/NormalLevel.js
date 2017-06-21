const Level = require('./Level');

class NormalLevel extends Level {
    constructor() {
        super();
        this.name = 'NormalLevel';
        this.level = 'normal';
    }

    getWordScore(wordInfo, history) { // Max 1000
        let word = history[history.length - 1],
            score = 900,
            lastChar = '',
            usedCount = 0;

        if (history.length >= 2) {
            lastChar = history[history.length - 2];
            lastChar = lastChar[lastChar.length - 1];
            usedCount = history.filter(element => {
                return element[element.length - 1] === lastChar;
            });
        }

        if (wordInfo.chainable % 2 === 1) {
            score += 100 - ((wordInfo.chainable - 1) * 2);
        } else {
            score -= wordInfo.chainable;
        }

        score = Math.max(score - Math.floor(wordInfo.startsWith / 10), 0);

        if (word[word.length - 1] === lastChar) {
            score = Math.max(score - usedCount * 10, 0);
        }

        if (score > 900) {
            return 0;
        }

        return score;
    }
}

module.exports = NormalLevel;