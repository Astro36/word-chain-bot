const Level = require('./Level');

class HardLevel extends Level {
    constructor() {
        super();
        this.name = 'HardLevel';
        this.level = 'hard';
    }

    getWordScore(word, wordInfo, history) { // Max 1000
        let score = 800;

        if (wordInfo.chain % 2 === 1) {
            score += 200 - ((wordInfo.chain - 1) * 10);
        } else {
            score -= 220 - (wordInfo.chain * 10);
        }

        score = Math.max(score - Math.floor((wordInfo.start || 0) / 100), 0);

        if (score > 900) {
            return 0;
        }

        return score;
    }
}

module.exports = HardLevel;