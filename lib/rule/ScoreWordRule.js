/* WordChainBot
Copyright (C) 2017  Astro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

const Rule = require('./Rule');

class ScoreWordRule extends Rule {
  constructor({
    pos = null, type = null, category = null, regex = null,
  }, bonusScore = 5) {
    super('ScoreWordRule');
    this.pos = pos;
    this.type = type;
    this.category = category;
    this.regex = regex;
    this.bonusScore = bonusScore;
  }

  getBonusScore() {
    return this.bonusScore;
  }

  getCategory() {
    return this.category;
  }

  getPOS() {
    return this.pos;
  }

  getRegExp() {
    return this.regex;
  }

  getScore(word) {
    const {
      pos, type, category, regex, bonusScore,
    } = this;
    if (!pos || (word.getPOS() || []).includes(pos)) {
      if (!type || (word.getType() || []).includes(type)) {
        if (!category || (word.getCategory() || []).includes(category)) {
          if (!regex || regex.test(word.getText())) {
            return bonusScore;
          }
        }
      }
    }
    return 0;
  }

  getType() {
    return this.type;
  }
}

module.exports = ScoreWordRule;
