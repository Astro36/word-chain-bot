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

const Word = require('./Word');
const FilterWordRule = require('./rule/FilterWordRule');

class WordFilter {
  static run(dictionary, ruleManager) {
    return new Promise(resolve => dictionary.getDB().all('SELECT * FROM dictionary WHERE LENGTH(TEXT)', (err, rows) => {
      const words = rows.map(row => Word.createFromObject(row));
      const rules = ruleManager.get(FilterWordRule);
      for (let i = 0, len = words.length; i < len; i += 1) {
        const word = words[i];
        for (let j = 0, len2 = rules.length; j < len2; j += 1) {
          if (!rules[j].isAvailable(word)) {
            words[i] = null;
            break;
          }
        }
      }
      resolve(words.filter(value => value !== null));
    }));
  }
}

module.exports = WordFilter;
