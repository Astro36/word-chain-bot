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

const SelectorLevel = require('./SelectorLevel');

class RandomSelectorLevel extends SelectorLevel {
  constructor(name = 'RandomSelectorLevel', scoreMax = 100) {
    super(name, scoreMax);
  }

  selectWord(words, rules, history) {
    const sum = nums => nums.reduce((previousValue, currentValue) => previousValue + currentValue);
    const calculateBonusScore = word => sum(rules.map(rule => rule.getScore(word)));
    const candidateWords = this.getCandidateWords(words, history);
    const wordScoreList = candidateWords.map(word => [word, 0]);
    let candidateWordList = null;
    if (rules.length >= 1) {
      wordScoreList.forEach((value) => {
        value[1] = calculateBonusScore(value[0]);
      });
      const scoreMax = Math.max(...wordScoreList.map(value => value[1]));
      candidateWordList = wordScoreList.filter(value => value[1] === scoreMax);
    } else {
      candidateWordList = wordScoreList;
    }
    const len = candidateWordList.length;
    if (len >= 1) {
      return candidateWordList[Math.floor(Math.random() * len)][0];
    }
    return null;
  }
}

module.exports = RandomSelectorLevel;
