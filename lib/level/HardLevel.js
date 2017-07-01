const Level = require('./Level');

class HardLevel extends Level {
    constructor() {
        super();
        this.name = 'HardLevel';
        this.level = 'hard';
    }

    getWordScore(word, wordInfo, history) { // Max 1000
        let score = super.getWordScore(word, wordInfo, history);

        if (score > 900) {
            return 0;
        }

        return score;
    }
}

module.exports = HardLevel;