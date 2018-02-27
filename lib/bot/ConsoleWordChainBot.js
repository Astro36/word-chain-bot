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

const WordChainBot = require('../WordChainBot');

class ConsoleWordChainBot extends WordChainBot {
  next(text) {
    const { history } = this;
    if (text === 'gg') {
      return '패배...';
    } else if (text === '?') {
      if (history.length > 0) {
        return history[history.length - 1].getMeaning().join('\n');
      }
    }
    try {
      const nextWord = super.next(text);
      if (nextWord) {
        return nextWord.getText();
      }
      return '승리!';
    } catch (e) {
      return e;
    }
  }
}

module.exports = ConsoleWordChainBot;
