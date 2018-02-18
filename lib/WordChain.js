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

const { KoreanDictionary } = require('korean-dictionary');

const Utils = require('./Utils');
const WordAnalyzer = require('./WordAnalyzer');
const WordFilter = require('./WordFilter');
const NotExistWordError = require('./exception/NotExistWordError');
const TooShortWordError = require('./exception/TooShortWordError');
const UnavailableWordError = require('./exception/UnavailableWordError');
const InitialSoundRule = require('./rule/InitialSoundRule');
const RuleManager = require('./rule/RuleManager');

class WordChain {
  constructor(path, rules = []) {
    this.dictionary = new KoreanDictionary(path);
    this.ruleManager = new RuleManager(rules);
    this.words = [];
  }

  getNextWords(text) {
    const { ruleManager, words } = this;
    const lastChar = Utils.getLastChar(text);
    if (ruleManager.has(InitialSoundRule)) {
      const lastChar2 = Utils.convertInitialSound(Utils.getLastChar(text));
      return words.filter((word) => {
        const firstChar = Utils.getFirstChar(word.getText());
        return firstChar === lastChar || firstChar === lastChar2;
      }) || null;
    }
    return words.filter(word => Utils.getFirstChar(word.getText()) === lastChar) || null;
  }

  getRuleManager() {
    return this.ruleManager;
  }

  getRules() {
    return this.ruleManager.getAll();
  }

  isAvailable(text) {
    const { words } = this;
    if (text.length >= 2) {
      if (/^[가-힣]+$/.test(text)) {
        if (words.some(word => word.getText() === text)) {
          return true;
        }
        throw new NotExistWordError();
      }
      throw new UnavailableWordError();
    }
    throw new TooShortWordError();
  }

  async init() {
    const { dictionary, ruleManager } = this;
    this.words = WordAnalyzer.run(WordFilter.run(dictionary, ruleManager), ruleManager);
  }
}

module.exports = WordChain;
