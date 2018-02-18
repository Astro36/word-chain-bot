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

exports.convertInitialSound = convertInitialSound;
exports.convertReversedInitialSounds = convertReversedInitialSounds;
exports.getFirstChar = getFirstChar;
exports.getLastChar = getLastChar;

exports.getInitialSoundMap = () => initialSounds;
exports.getReversedInitialSoundMap = () => reversedInitialSounds;
