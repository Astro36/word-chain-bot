const Level = require('./Level');

class EasyLevel extends Level {
    constructor() {
        super();
        this.name = 'EasyLevel';
        this.level = 'easy';
    }

    getWordScore(word, wordInfo, history) { // Max 1000
        let score = 800;

        if (wordInfo.chain % 2 === 1) {
            score += 200 - ((wordInfo.chain - 1) * 10);
        } else {
            score -= 220 - (wordInfo.chain * 10);
        }

        score = Math.max(score - Math.floor((wordInfo.start || 0) / 100), 0);

        if (score > 600) {
            return 0;
        }

        if (history.length >= 2) {
            let lastChar = word[word.length - 1];
            score = Math.max(score - history.filter(element => {
                return element[element.length - 1] === lastChar;
            }).length * 100, 0);
        }

        return score;
    }
}

module.exports = EasyLevel;