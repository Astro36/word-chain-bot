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
    return reversedInitialSounds[newChar].map(value => String.fromCharCode(value.charCodeAt(0) + final));
  }
  return [char];
};

exports.convertInitialSound = convertInitialSound;
exports.convertReversedInitialSounds = convertReversedInitialSounds;
exports.getInitialSoundMap = () => initialSounds;
exports.getReversedInitialSoundMap = () => reversedInitialSounds;
