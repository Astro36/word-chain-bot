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
    if (super.isAvailable(text)) {
      if (history.length > 0) {
        const lastText = history[history.length - 1];
        const lastChar = Utils.getLastChar(lastText);
        const firstChar = Utils.getFirstChar(text);
        if (firstChar !== lastChar) {
          if (!ruleManager.has(InitialSoundRule)) {
            throw new UnavailableWordError();
          } else if (firstChar !== Utils.convertInitialSound(lastChar)) {
            throw new UnavailableWordError();
          }
        }
        if (!history.includes(text)) {
          return true;
        }
        throw new AlreadyUsedWordError();
      }
    }
    return false;
  }

  next(text) {
    const { history, level, ruleManager } = this;
    if (this.isAvailable(text)) {
      history.push(text);
      const nextWords = this.getNextWords(text);
      if (nextWords) {
        let candidateWords = [];
        let scoreMax = 0;
        for (let i = 0, len = nextWords.length; i < len; i += 1) {
          const word = nextWords[i];
          if (!history.includes(word.getText())) {
            if (level.isAvailable(word, history)) {
              const score = word.getScore();
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
          const rules = ruleManager.get(ScoreWordRule);
          candidateWords.forEach((word) => {
            for (let i = 0, len = rules.length; i < len; i += 1) {
              word.score += rules[i].getBonusScore(word);
            }
          });
          scoreMax = Math.max(...candidateWords.map(value => value.getScore()));
          candidateWords = candidateWords.filter(value => value.getScore() === scoreMax);
          const nextWord = candidateWords[Math.floor(Math.random() * candidateWords.length)];
          history.push(nextWord.getText());
          return nextWord;
        }
      }
    }
    return null;
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
