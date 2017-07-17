import Level from './Level';

export default class EasyLevel extends Level {
  constructor() {
    super();
    this.name = 'EasyLevel';
    this.level = 'easy';
  }

  static getWordScore(word, wordInfo, history) { // Max 1000
    let score = super.getWordScore(word, wordInfo, history);

    if (score > 600 || (wordInfo.start || 0) < 100) {
      return 0;
    }

    if (history.length >= 2) {
      const lastChar = word[word.length - 1];
      score = Math.max(score - (history.filter(element => element[element.length - 1] === lastChar).length * 100), 0);
    }

    return score;
  }
}
