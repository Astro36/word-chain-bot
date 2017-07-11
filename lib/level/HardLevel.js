const Level = require('./Level');

class HardLevel extends Level {
  constructor() {
    super();
    this.name = 'HardLevel';
    this.level = 'hard';
  }

  static getWordScore(word, wordInfo, history) { // Max 1000
    const score = super.getWordScore(word, wordInfo, history);

    if (score > 900) {
      return 0;
    }

    return score;
  }
}

module.exports = HardLevel;
