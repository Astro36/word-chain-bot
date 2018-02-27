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

const Defaults = require('./Defaults');
const Utils = require('./Utils');
const WordChain = require('./WordChain');
const AlreadyUsedWordError = require('./exception/AlreadyUsedWordError');
const UnavailableWordError = require('./exception/UnavailableWordError');
const InitialSoundRule = require('./rule/InitialSoundRule');
const ScoreWordRule = require('./rule/ScoreWordRule');

class WordChainBot extends WordChain {
  constructor(dictionary, rules = Defaults.rules, level = Defaults.level) {
    super(dictionary, rules);
    this.level = level;
    this.history = [];
  }

  clearHistory() {
    this.history = [];
  }

  getHistory() {
    return this.history;
  }

  getLevel() {
    return this.level;
  }

  isAvailable(text) {
    const { history, ruleManager } = this;
    const valid = super.isAvailable(text);
    if (valid === true) {
      if (history.length > 0) {
        const lastText = history[history.length - 1];
        const lastChar = Utils.getLastChar(lastText);
        const firstChar = Utils.getFirstChar(text);
        if (firstChar !== lastChar) {
          if (!ruleManager.has(InitialSoundRule)) {
            return new UnavailableWordError();
          } else if (firstChar !== Utils.convertInitialSound(lastChar)) {
            return new UnavailableWordError();
          }
        }
        if (!history.includes(text)) {
          return true;
        }
        return new AlreadyUsedWordError();
      }
    }
    return valid;
  }

  next(text) {
    const { history, level, ruleManager } = this;
    const valid = this.isAvailable(text);
    if (valid === true) {
      history.push(text);
      const nextWords = this.getNextWords(text);
      if (nextWords) {
        const nextWord = level.selectWord(nextWords.filter(word => !history.includes(word.getText())), ruleManager.get(ScoreWordRule), history);
        if (nextWord) {
          history.push(nextWord.getText());
          return nextWord;
        }
      }
      return null;
    }
    throw valid;
  }

  setLevel(level) {
    this.level = level;
  }

  async init() {
    await super.init();
    this.history = [];
  }
}

module.exports = WordChainBot;
