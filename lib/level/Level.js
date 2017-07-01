class Level {
    constructor() {
        this.name = 'Level';
    }

    getWordScore(word, wordInfo, history) { // Max 1000
        let score = 800;

        if (wordInfo.chain % 2 === 1) {
            score += 200 - ((wordInfo.chain - 1) * 10);
        } else {
            score -= 220 - (wordInfo.chain * 10);
        }

        score = Math.max(score - Math.floor((wordInfo.start || 0) / 100), 0);

        return score;
    }
}

module.exports = Level;