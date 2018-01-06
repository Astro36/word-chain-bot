const Level = require('./Level');

class EasyLevel extends Level {
  constructor() {
    super('EasyLevel');
  }

  isAvailable(word, score) {
    return score < 40;
  }
}

module.exports = EasyLevel;
