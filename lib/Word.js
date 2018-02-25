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

const { Word: KoreanWord } = require('korean-dictionary');

class Word extends KoreanWord {
  constructor(text, pos = null, type = null, category = null, meaning = null, score = null) {
    super(text, pos, type, category, meaning);
    this.score = score;
  }

  static createFromObject({
    text, pos, type, category, meaning, score,
  }) {
    return new Word(text, pos, type, category, meaning, score);
  }

  getScore() {
    return this.score;
  }

  toObject() {
    return {
      text: this.text,
      pos: this.pos,
      type: this.type,
      category: this.category,
      meaning: this.meaning,
      score: this.score,
    };
  }

  updateScore(score) {
    this.score = score;
  }
}

module.exports = Word;
