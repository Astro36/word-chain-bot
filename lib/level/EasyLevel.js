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

const OptimizedSelectorLevel = require('./OptimizedSelectorLevel');
const Utils = require('../Utils');

class EasyLevel extends OptimizedSelectorLevel {
  constructor() {
    super('EasyLevel', 50);
  }

  getCandidateWords(words, history) {
    return super.getCandidateWords(words).filter((word) => {
      const lastChar = Utils.getLastChar(word.getText());
      return history.filter(value => Utils.getLastChar(value) === lastChar).length < 3;
    });
  }

  selectWord(words, rules, history) {
    const sum = nums => nums.reduce((previousValue, currentValue) => previousValue + currentValue);
    const calculateBonusScore = word => (rules.length >= 1 ? sum(rules.map(rule => rule.getScore(word))) : 0);
    const calculateScore = word => Math.floor(Math.sqrt(word.getScore() * 10) + calculateBonusScore(word));
    const candidateWords = this.getCandidateWords(words, history);
    const candidateWordList = candidateWords.map(word => [word, calculateScore(word)]);
    const len = candidateWordList.length;
    if (len >= 1) {
      return candidateWordList[Math.floor(Math.random() * len)][0];
    }
    return null;
  }
}

module.exports = EasyLevel;
