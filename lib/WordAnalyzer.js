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

const Utils = require('./Utils');
const InitialSoundRule = require('./rule/InitialSoundRule');

class WordAnalyzer {
  static run(words, ruleManager) {
    const isEnabledInitialSoundRule = ruleManager.has(InitialSoundRule);
    // Create word tree
    const tree = {};
    const treeSize = {};
    const reversedTree = {};
    for (let i = 0, len = words.length; i < len; i += 1) {
      const { text } = words[i];
      const firstChar = Utils.getFirstChar(text);
      const lastChar = Utils.getLastChar(text);
      if (firstChar in tree) {
        tree[firstChar][lastChar] = 0;
        treeSize[firstChar] = 0;
      } else {
        tree[firstChar] = { [lastChar]: 0 };
        treeSize[firstChar] += 1;
      }
      if (lastChar in reversedTree) {
        reversedTree[lastChar][firstChar] = 0;
      } else {
        reversedTree[lastChar] = { [firstChar]: 0 };
      }
    }
    // Compute minimum tree size
    const chains = {};
    const killerChars = [];
    if (isEnabledInitialSoundRule) { // 두음법칙 사용
      const getFullChain = (lastChar, chainSize) => {
        if (!(lastChar in chains)) {
          chains[lastChar] = 5;
        }
        if (chainSize < chains[lastChar]) {
          chainSize += 1;
          chains[lastChar] = chainSize;
          for (const firstChar in reversedTree[lastChar]) {
            const sounds = Utils.convertReversedInitialSounds(firstChar);
            for (let i = 0, len = sounds.length; i < len; i += 1) {
              getFullChain(sounds[i], chainSize);
            }
          }
        }
      };
      for (const lastChar in reversedTree) {
        if (!(lastChar in tree || Utils.convertInitialSound(lastChar) in tree)) {
          if (!killerChars.includes(lastChar)) {
            killerChars.push(lastChar);
          }
        }
      }
      for (let i = 0, len = killerChars.length; i < len; i += 1) {
        getFullChain(killerChars[i], 0);
      }
    } else { // 두음법칙 미사용
      const getFullChain = (lastChar, chainSize) => {
        if (!(lastChar in chains)) {
          chains[lastChar] = 5;
        }
        if (chainSize < chains[lastChar]) {
          chainSize += 1;
          chains[lastChar] = chainSize;
          for (const firstChar in reversedTree[lastChar]) {
            getFullChain(firstChar, chainSize);
          }
        }
      };
      for (const lastChar in reversedTree) {
        if (!(lastChar in tree)) {
          if (!killerChars.includes(lastChar)) {
            killerChars.push(lastChar);
          }
        }
      }
      for (let i = 0, len = killerChars.length; i < len; i += 1) {
        getFullChain(killerChars[i], 0);
      }
    }
    // Score the words
    const scores = {};
    if (isEnabledInitialSoundRule) { // 두음법칙 사용
      for (const lastChar in chains) {
        const chainSize = chains[lastChar] || 1;
        let score = 0;
        if (chainSize % 2 === 1) {
          score = 100 - (Math.floor(chainSize / 2) * 10);
        } else {
          score = 60 + (Math.floor((chainSize) / 2) * 10);
        }
        if (lastChar in treeSize) {
          scores[lastChar] = Math.max(score - Math.sqrt(treeSize[lastChar]), 0);
        } else {
          const sound = Utils.convertInitialSound(lastChar);
          if (sound in treeSize) {
            scores[lastChar] = Math.max(score - Math.sqrt(treeSize[sound]), 0);
          } else {
            scores[lastChar] = 99;
          }
        }
      }
    } else { // 두음법칙 미사용
      for (const lastChar in chains) {
        const chainSize = chains[lastChar] || 1;
        let score = 0;
        if (chainSize % 2 === 1) {
          score = 100 - (Math.floor(chainSize / 2) * 10);
        } else {
          score = 60 + (Math.floor((chainSize) / 2) * 10);
        }
        if (lastChar in treeSize) {
          scores[lastChar] = Math.max(score - Math.sqrt(treeSize[lastChar]), 0);
        } else {
          scores[lastChar] = 99;
        }
      }
    }
    for (let i = 0, len = words.length; i < len; i += 1) {
      const word = words[i];
      word.score = scores[Utils.getLastChar(word.text)];
    }
    return words.sort((a, b) => {
      const comparedScore = b.score - a.score;
      if (comparedScore === 0) {
        return Utils.getFirstChar(a.text).localeCompare(Utils.getFirstChar(b.text));
      }
      return comparedScore;
    });
  }
}

module.exports = WordAnalyzer;
