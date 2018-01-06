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

const fs = require('fs');
const { Dictionary, Word } = require('korean-dictionary');

const Utils = require('./Utils');
const FilterWordRule = require('./rule/FilterWordRule');

class DictionaryAnalyzer {
  constructor(dictionary, rules) {
    this.dictionary = dictionary;
    this.rules = rules;
    this.scores = {};
  }

  static createFromData(path) {
    const data = JSON.parse(fs.readFileSync(path));
    const dictionaryAnalyzer = new DictionaryAnalyzer(new Dictionary(data.dictionary_path), data.rules);
    dictionaryAnalyzer.scores = data.scores;
    return dictionaryAnalyzer;
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  getNextWords(text) {
    return new Promise((resolve) => {
      const { dictionary, rules } = this;
      const lastChar = text[text.length - 1];
      dictionary.getDB().all(`SELECT * FROM dictionary WHERE LENGTH(TEXT) >= 2${rules.length > 0 && ` AND ${rules.filter(rule => rule instanceof FilterWordRule || (typeof rule === 'string' && /^FilterWordRule>[A-z>]+:/.test(rule))).map(rule => (rule instanceof FilterWordRule ? rule.getSQL() : rule.replace(/^FilterWordRule>[A-z>]+:/, ''))).join(' AND ')}`} AND (text LIKE "${lastChar}%" OR text LIKE "${Utils.convertInitialSound(lastChar)}%");`, (err, rows) => {
        if (rows) {
          const { scores } = this;
          resolve(rows.sort((a, b) => {
            const textA = a.text;
            const textB = b.text;
            return scores[textB[textB.length - 1]] - scores[textA[textA.length - 1]];
          }).map(row => [new Word(row.text, JSON.parse(row.type), JSON.parse(row.theme), JSON.parse(row.meaning)), scores[row.text[row.text.length - 1]]]));
        } else {
          resolve(null);
        }
      });
    });
  }

  getRules() {
    return this.rules;
  }

  getScore(text) {
    const { scores } = this;
    const lastChar = text[text.length - 1];
    if (lastChar in scores) {
      return scores[lastChar];
    }
    return null;
  }

  init() {
    return new Promise((resolve) => {
      const { dictionary, rules } = this;
      const db = dictionary.getDB();
      db.all(`SELECT distinct SUBSTR(text, 1, 1) AS first_char, SUBSTR(text, -1, 1) AS last_char FROM dictionary WHERE LENGTH(TEXT) >= 2${rules.length > 0 && ` AND ${rules.filter(rule => rule instanceof FilterWordRule).map(rule => rule.getSQL()).join(' AND ')}`};`, (err, rows) => {
        const tree = {};
        const reversedTree = {};
        for (let i = 0, len = rows.length; i < len; i += 1) {
          const { first_char: firstChar, last_char: lastChar } = rows[i];
          if (firstChar in tree) {
            tree[firstChar][lastChar] = 0;
          } else {
            tree[firstChar] = { [lastChar]: 0 };
          }
          if (lastChar in reversedTree) {
            reversedTree[lastChar][firstChar] = 0;
          } else {
            reversedTree[lastChar] = { [firstChar]: 0 };
          }
        }
        const chains = {};
        const getFullChain = (lastChar, chainSize) => {
          if (!(lastChar in chains)) {
            chains[lastChar] = 20;
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
        const killerChars = [];
        for (const lastChar in reversedTree) {
          if (!(lastChar in tree) && killerChars.indexOf(lastChar) < 0) {
            killerChars.push(lastChar);
          }
        }
        for (let i = 0, len = killerChars.length; i < len; i += 1) {
          getFullChain(killerChars[i], 0);
        }
        db.all('SELECT first_char, COUNT(first_char) AS count FROM (SELECT SUBSTR(text, 1, 1) AS first_char FROM dictionary WHERE LENGTH(TEXT) >= 2) GROUP BY first_char;', (err2, rows2) => {
          const scores = {};
          const counts = {};
          for (let i = 0, len = rows2.length; i < len; i += 1) {
            const row = rows2[i];
            counts[row.first_char] = row.count;
          }
          for (const i in chains) {
            if (chains[i] % 2 === 1) {
              scores[i] = Math.max(100 - (Math.floor(chains[i] / 2) * 20) - (Math.log((counts[i] || 0) + 1) * 5), 0);
            } else {
              scores[i] = Math.max(60 - (Math.floor((4 - chains[i]) / 2) * 20) - (Math.log((counts[i] || 0) + 1) * 5), 0);
            }
          }
          this.scores = scores;
          resolve();
        });
      });
    });
  }

  saveAsFile(path) {
    fs.writeFileSync(path, JSON.stringify({
      dictionary_path: this.dictionary.getDictionaryPath(),
      rules: this.rules,
      scores: this.scores,
    }));
  }

  setRules(rules) {
    this.rules = rules;
  }
}

module.exports = DictionaryAnalyzer;
