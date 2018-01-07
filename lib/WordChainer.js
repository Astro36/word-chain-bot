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
const AllowedPOSRule = require('./rule/AllowedPOSRule');
const AllowedTypeRule = require('./rule/AllowedTypeRule');
const FilterWordRule = require('./rule/FilterWordRule');

const wordRegExp = /^[가-힣]+$/;

class WordChainer {
  constructor(path, level, rules = [new AllowedPOSRule('명사'), new AllowedTypeRule()]) {
    this.dictionary = new KoreanDictionary(path);
    this.dictionaryAnalyzer = new DictionaryAnalyzer(this.dictionary, rules);
    this.level = level;
    this.rules = rules;
    this.history = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  clear() {
    this.history = [];
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
      const candidateWords = [];
      let scoreMax = 0;
      for (let i = 0, len = words.length; i < len; i += 1) {
        const [word, score] = words[i];
        const wordText = word.getText();
        if (history.indexOf(wordText) < 0) {
          if (level.isAvailable(word, score, history) && wordRegExp.test(wordText)) {
            if (scoreMax <= score) {
              candidateWords.push(word);
              scoreMax = Math.ceil(score);
            } else {
              break;
            }
          }
        }
      }
      if (candidateWords.length >= 1) {
        return candidateWords[Math.floor(Math.random() * candidateWords.length)];
      }
    }
    return null;
  }

  getRules() {
    return this.rules;
  }

  async isAvailable(text) {
    return new Promise((resolve, reject) => {
      const { dictionary, rules, history } = this;
      if (text.length >= 2) {
        if (wordRegExp.test(text)) {
          if (history.length > 0) {
            const lastText = history[history.length - 1];
            const lastChar = Utils.getLastChar(lastText);
            if (lastChar !== text[0] && Utils.convertInitialSound(lastChar) !== text[0]) {
              reject(new UnavailableWordError());
              return;
            }
          }
          if (history.indexOf(text) < 0) {
            dictionary.getDB().get(`SELECT * FROM dictionary WHERE LENGTH(TEXT) >= 2${rules.length > 0 && ` AND ${rules.filter(rule => rule instanceof FilterWordRule || (typeof rule === 'string' && /^FilterWordRule>[A-z>]+:/.test(rule))).map(rule => (rule instanceof FilterWordRule ? rule.getSQL() : rule.replace(/^FilterWordRule>[A-z>]+:/, ''))).join(' AND ')}`} AND text LIKE "${text}%";`, (err, row) => {
              if (row) {
                resolve(true);
              } else {
                reject(new NotExistWordError());
              }
            });
          } else {
            reject(new AlreadyUsedWordError());
          }
        } else {
          reject(new UnavailableWordError());
        }
      } else {
        reject(new TooShortWordError());
      }
    });
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
