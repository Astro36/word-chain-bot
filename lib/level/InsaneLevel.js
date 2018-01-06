const Level = require('./Level');

class InsaneLevel extends Level {
  constructor() {
    super('InsaneLevel');
  }

  isAvailable() {
    return true;
  }
}

module.exports = InsaneLevel;
