const Level = require('./Level');

class NormalLevel extends Level {
  constructor() {
    super();
    this.name = 'NormalLevel';
    this.level = 'normal';
  }

  static getWordScore(word, wordInfo, history) { // Max 1000
    let score = super.getWordScore(word, wordInfo, history);

    if (score > 700) {
      return 0;
    }

    if (history.length >= 2) {
      const lastChar = word[word.length - 1];
      score = Math.max(score - (history.filter(element => element[element.length - 1] === lastChar).length * 50), 0);
    }

    return score;
  }
}

module.exports = NormalLevel;
