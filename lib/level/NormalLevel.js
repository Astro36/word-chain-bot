const Level = require('./Level');

class NormalLevel extends Level {
  constructor() {
    super('NormalLevel');
  }

  isAvailable(word, score) {
    return score < 60;
  }
}

module.exports = NormalLevel;
