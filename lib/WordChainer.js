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

const DictionaryAnalyzer = require('./DictionaryAnalyzer');
const Utils = require('./Utils');
const AlreadyUsedWordError = require('./exception/AlreadyUsedWordError');
const NotExistWordError = require('./exception/NotExistWordError');
const TooShortWordError = require('./exception/TooShortWordError');
const UnavailableWordError = require('./exception/UnavailableWordError');

const wordRegExp = /^[가-힣]+$/;

class WordChainer {
  constructor(path, level, rules) {
    this.dictionary = new KoreanDictionary(path);
    this.dictionaryAnalyzer = new DictionaryAnalyzer(this.dictionary, rules);
    this.level = level;
    this.rules = rules;
    this.history = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  getHistory() {
    return this.history;
  }

  getLevel() {
    return this.level;
  }

  async getNextWord(text) {
    const { dictionaryAnalyzer, level, history } = this;
    const words = await dictionaryAnalyzer.getNextWords(text);
    if (words !== null) {
      let scoreMax = 0;
      for (let i = 0, len = words.length; i < len; i += 1) {
        const [word, score] = words[i];
        const wordText = word.getText();
        if (level.isAvailable(word, score, history) && history.indexOf(wordText) < 0 && wordRegExp.test(wordText)) {
          if (scoreMax <= score) {
            scoreMax = score;
          } else {
            break;
          }
        }
      }
      const cadidateWords = words.filter(value => value[1] === scoreMax);
      return cadidateWords[Math.floor(Math.random() * cadidateWords.length)][0];
    }
    return null;
  }

  getRules() {
    return this.rules;
  }

  async isAvailable(text) {
    const { dictionary, history } = this;
    if (text.length >= 2) {
      if (wordRegExp.test(text)) {
        if (history.length > 0) {
          const lastText = history[history.length - 1];
          const lastChar = lastText[lastText.length - 1];
          if (lastChar !== text[0] && Utils.convertInitialSound(lastChar) !== text[0]) {
            throw new UnavailableWordError();
          }
        }
        if (history.indexOf(text) < 0) {
          if (await dictionary.has(text)) {
            return true;
          }
          throw new NotExistWordError();
        }
        throw new AlreadyUsedWordError();
      }
      throw new UnavailableWordError();
    }
    throw new TooShortWordError();
  }

  async next(text) {
    const { history } = this;
    if (await this.isAvailable(text)) {
      history.push(text);
      const nextWord = await this.getNextWord(text);
      if (nextWord) {
        history.push(nextWord.getText());
      }
      return nextWord;
    }
    return null;
  }

  setLevel(level) {
    this.level = level;
  }

  setRules(rules) {
    this.rules = rules;
  }

  async init() {
    this.history = [];
    await this.dictionaryAnalyzer.init();
  }
}

module.exports = WordChainer;
