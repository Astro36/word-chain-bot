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
const AllowInitialSoundRule = require('./rule/AllowInitialSoundRule');
const FilterWordRule = require('./rule/FilterWordRule');

const initialSounds = {
  녀: '여',
  뇨: '요',
  뉴: '유',
  니: '이',
  랴: '야',
  려: '여',
  례: '예',
  료: '요',
  류: '유',
  리: '이',
  라: '나',
  래: '내',
  로: '노',
  뢰: '뇌',
  루: '누',
  르: '느',
};
const reversedInitialSounds = {
  여: ['녀', '려'],
  요: ['뇨', '료'],
  유: ['뉴', '류'],
  이: ['니', '리'],
  야: ['랴'],
  예: ['례'],
  나: ['라'],
  내: ['래'],
  노: ['로'],
  뇌: ['뢰'],
  누: ['루'],
  느: ['르'],
};

const getFirstChar = text => text[0];
const getLastChar = text => text[text.length - 1];

const checkAllowedInitialSoundRule = rules => rules.some(rule => rule instanceof AllowInitialSoundRule);

const combineScore = (words, scores) => {
  for (let i = 0, len = words.length; i < len; i += 1) {
    const word = words[i];
    word.score = scores[getLastChar(word.text)];
  }
  return words;
};

const convertInitialSound = (char) => {
  const code = char.charCodeAt(0) - 44032;
  const final = code % 28;
  const newChar = String.fromCharCode((code - final) + 44032);
  if (newChar in initialSounds) {
    return String.fromCharCode(initialSounds[newChar].charCodeAt(0) + final);
  }
  return char;
};

const convertReversedInitialSounds = (char) => {
  const code = char.charCodeAt(0) - 44032;
  const final = code % 28;
  const newChar = String.fromCharCode((code - final) + 44032);
  if (newChar in reversedInitialSounds) {
    const newChars = reversedInitialSounds[newChar];
    return [char, ...newChars.map(value => String.fromCharCode(value.charCodeAt(0) + final))];
  }
  return [char];
};

const getAvailableWords = (dictionary, rules = []) => {
  if (rules) {
    return new Promise(resolve => dictionary.getDB().all(`SELECT * FROM dictionary WHERE LENGTH(TEXT) >= 2 AND ${rules.filter(rule => rule instanceof FilterWordRule).map(rule => rule.getSQL()).join(' AND ')}`, (err, rows) => resolve(rows.map(row => Word.createFromObject(row)))));
  }
  return new Promise(resolve => dictionary.getDB().all('SELECT * FROM dictionary WHERE LENGTH(TEXT) >= 2', (err, rows) => resolve(rows.map(row => Word.createFromObject(row)))));
};

const getWordsScoreMap = (words, rules = []) => {
  // Create word tree
  const tree = {};
  const treeSize = {};
  const reversedTree = {};
  for (let i = 0, len = words.length; i < len; i += 1) {
    const { text } = words[i];
    const firstChar = getFirstChar(text);
    const lastChar = getLastChar(text);
    if (firstChar in tree) {
      tree[firstChar][lastChar] = 0;
      treeSize[firstChar] = 0;
    } else {
      tree[firstChar] = { [lastChar]: 0 };
      treeSize[firstChar] += 1;
    }
    if (lastChar in reversedTree) {
      reversedTree[lastChar][firstChar] = 0;
    } else {
      reversedTree[lastChar] = { [firstChar]: 0 };
    }
  }
  // Compute minimum tree size
  const chains = {};
  const getFullChain = (lastChar, chainSize) => {
    if (!(lastChar in chains)) {
      chains[lastChar] = 5;
    }
    if (chainSize < chains[lastChar]) {
      chainSize += 1;
      chains[lastChar] = chainSize;
      for (const firstChar in reversedTree[lastChar]) {
        const sounds = convertReversedInitialSounds(firstChar);
        for (let i = 0, len = sounds.length; i < len; i += 1) {
          getFullChain(sounds[i], chainSize);
        }
      }
    }
  };
  const killerChars = [];
  for (const lastChar in reversedTree) {
    if (!(lastChar in tree || convertInitialSound(lastChar) in tree)) {
      if (killerChars.indexOf(lastChar) < 0) {
        killerChars.push(lastChar);
      }
    }
  }
  for (let i = 0, len = killerChars.length; i < len; i += 1) {
    getFullChain(killerChars[i], 0);
  }
  // Score the words
  const scores = {};
  for (const lastChar in chains) {
    const chainSize = chains[lastChar] || 1;
    let score = 0;
    if (chainSize % 2 === 1) {
      score = 100 - (Math.floor(chainSize / 2) * 10);
    } else {
      score = 60 + (Math.floor((chainSize) / 2) * 10);
    }
    if (lastChar in treeSize) {
      scores[lastChar] = Math.max(score - Math.sqrt(treeSize[lastChar]), 0);
    } else {
      const sound = convertInitialSound(lastChar);
      if (sound in treeSize) {
        scores[lastChar] = Math.max(score - Math.sqrt(treeSize[sound]), 0);
      } else {
        scores[lastChar] = 99;
      }
    }
  }
  return scores;
};

const sortWordsByScore = words => words.sort((a, b) => {
  const comparedScore = b.score - a.score;
  if (comparedScore === 0) {
    return getFirstChar(a.text).localeCompare(getFirstChar(b.text));
  }
  return comparedScore;
});

exports.checkAllowedInitialSoundRule = checkAllowedInitialSoundRule;
exports.combineScore = combineScore;
exports.convertInitialSound = convertInitialSound;
exports.convertReversedInitialSounds = convertReversedInitialSounds;
exports.getAvailableWords = getAvailableWords;
exports.getFirstChar = getFirstChar;
exports.getLastChar = getLastChar;
exports.getWordsScoreMap = getWordsScoreMap;
exports.sortWordsByScore = sortWordsByScore;

exports.getInitialSoundMap = () => initialSounds;
exports.getReversedInitialSoundMap = () => reversedInitialSounds;
