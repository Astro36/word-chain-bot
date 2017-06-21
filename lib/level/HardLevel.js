const Level = require('./Level');

class HardLevel extends Level {
    constructor() {
        super();
        this.name = 'HardLevel';
        this.level = 'hard';
    }

    getWordScore(wordInfo, history) { // Max 1000
        let score = 900;

        if (wordInfo.chainable % 2 === 1) {
            score += 100 - ((wordInfo.chainable - 1) * 2);
        } else {
            score -= wordInfo.chainable;
        }

        score = Math.max(score - Math.floor(wordInfo.startsWith / 10), 0);

        if (score > 950) {
            return 0;
        }

        return score;
    }
}

module.exports = HardLevel;