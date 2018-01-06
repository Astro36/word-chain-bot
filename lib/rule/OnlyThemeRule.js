const FilterWordRule = require('./FilterWordRule');

class OnlyThemeRule extends FilterWordRule {
  constructor(themes) {
    super('OnlyThemeRule', `(theme IS NULL OR ${themes.map(theme => `theme LIKE "%${theme}%"`).join(' OR ')})`);
    this.themes = themes;
  }

  getThemes() {
    return this.themes;
  }
}

module.exports = OnlyThemeRule;
