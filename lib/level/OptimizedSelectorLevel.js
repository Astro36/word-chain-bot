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

const Level = require('./Level');

class OptimizedSelectorLevel extends Level {
  constructor(name = 'OptimizedSelectorLevel', scoreMax = 100) {
    super(name);
    this.scoreMax = scoreMax;
  }

  getCandidateWords(words) {
    const { scoreMax } = this;
    return words.filter(word => word.getScore() <= scoreMax);
  }

  selectWord(words, rules) {
    const sum = nums => nums.reduce((previousValue, currentValue) => previousValue + currentValue);
    const calculateBonusScore = word => (rules.length >= 1 ? sum(rules.map(rule => rule.getScore(word))) : 0);
    const calculateScore = word => Math.floor(Math.sqrt(word.getScore() * 10) + calculateBonusScore(word));
    const candidateWords = this.getCandidateWords(words);
    const wordScoreList = candidateWords.map(word => [word, calculateScore(word)]);
    const scoreMax = Math.max(...wordScoreList.map(value => value[1]));
    const candidateWordList = wordScoreList.filter(value => value[1] === scoreMax);
    const len = candidateWordList.length;
    if (len >= 1) {
      return candidateWordList[Math.floor(Math.random() * len)][0];
    }
    return null;
  }
}

module.exports = OptimizedSelectorLevel;
