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

class OptimizedSelectorLevel extends SelectorLevel {
  constructor(name = 'OptimizedSelectorLevel', scoreMax = 100) {
    super(name, scoreMax);
  }

  selectWord(words, rules) {
    const sum = nums => nums.reduce((previousValue, currentValue) => previousValue + currentValue);
    const calculateBonusScore = word => sum(rules.map(rule => rule.getScore(word)));
    const calculateScore = word => Math.floor(Math.sqrt(word.getScore()));
    const candidateWords = this.getCandidateWords(words);
    const wordScoreList = candidateWords.map(word => [word, calculateScore(word)]);
    const scoreMax = Math.max(...wordScoreList.map(value => value[1]));
    let candidateWordList = null;
    if (rules.length >= 1) {
      const wordScoreList2 = wordScoreList.filter(value => value[1] === scoreMax);
      wordScoreList2.forEach((value) => {
        value[1] = calculateBonusScore(value[0]);
      });
      const scoreMax2 = Math.max(...wordScoreList2.map(value => value[1]));
      candidateWordList = wordScoreList2.filter(value => value[1] === scoreMax2);
    } else {
      candidateWordList = wordScoreList.filter(value => value[1] === scoreMax);
    }
    const len = candidateWordList.length;
    if (len >= 1) {
      return candidateWordList[Math.floor(Math.random() * len)][0];
    }
    return null;
  }
}

module.exports = OptimizedSelectorLevel;
