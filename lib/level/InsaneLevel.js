const Level = require('./Level');

class InsaneLevel extends Level {
    constructor() {
        super();
        this.name = 'InsaneLevelBehavior';
        this.level = 'insane';
    }
}

module.exports = InsaneLevel;