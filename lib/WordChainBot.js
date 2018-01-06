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

const WordChainer = require('./WordChainer');
const EasyLevel = require('./level/EasyLevel');
const OnlyNounRule = require('./rule/OnlyNounRule');

class WordChainBot extends WordChainer {
  constructor(path, level = new EasyLevel(), rules = [new OnlyNounRule()]) {
    super(path, level, rules);
    this.lastWord = null;
  }

  async next(text) {
    return new Promise((resolve) => {
      if (text === 'gg') {
        resolve('패배...');
      } else if (text === '?') {
        resolve(this.lastWord.getMeaning().join('\n'));
      }
      super.next(text)
        .then((nextWord) => {
          if (nextWord) {
            this.lastWord = nextWord;
            resolve(nextWord.getText());
          }
          resolve('승리!');
        })
        .catch((e) => {
          resolve(e.message);
        });
    });
  }
}

module.exports = WordChainBot;
