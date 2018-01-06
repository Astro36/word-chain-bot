const Level = require('./Level');

class HardLevel extends Level {
  constructor() {
    super('HardLevel');
  }

  isAvailable(word, score) {
    return score < 80;
  }
}

module.exports = HardLevel;
