const Dictionary = require('./Dictionary');

const LearningAI = require('./ai/LearningAI');

const WordException = require('./exception/WordException');
const ForbiddenWordException = require('./exception/ForbiddenWordException');
const InvalidWordException = require('./exception/InvalidWordException');
const NotFoundWordException = require('./exception/NotFoundWordException');
const UsedWordException = require('./exception/UsedWordException');

const Level = require('./level/Level');
const EasyLevel = require('./level/EasyLevel');
const NormalLevel = require('./level/NormalLevel');
const HardLevel = require('./level/HardLevel');
const InsaneLevel = require('./level/InsaneLevel');

const Rule = require('./rule/Rule');

class WordChainer {
  constructor(level, name = 'test', rules = [Rule.ALLOWED_INITIAL]) {
    this.dictionary = Dictionary.getInstance();
    this.learning = new LearningAI(name);
    this.level = level;
    this.name = name;
    this.rules = rules;
    this.history = [];
  }

  getHistory() {
    return this.history;
  }

  isValidWord(word) {
    const dictionaryObj = this.dictionary.getDictionaryObject();
    const rules = this.rules;
    const history = this.history;

    // 중복 사용
    if (history.indexOf(word) >= 0) {
      throw new UsedWordException();
    }

    // 사전
    const startChar = word[0];
    if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
      // 특수단어
      if (dictionaryObj[startChar][word].extra.length > 0 && rules.indexOf(Rule.ALLOWED_EXTRA) < 0) {
        throw new NotFoundWordException();
      }
      // 매너
      if (dictionaryObj[startChar][word].start <= 5 && rules.indexOf(Rule.MANNER) >= 0) {
        throw new ForbiddenWordException();
      }
    } else {
      throw new NotFoundWordException();
    }

    // 한방단어
    if (history.length === 0 && !(word[word.length - 1] in dictionaryObj)) {
      throw new InvalidWordException();
    } else if (history.length > 0) {
      // 끝말잇기
      const lastWord = history[history.length - 1];
      if (lastWord[lastWord.length - 1] !== word[0]) {
                // 두음법칙
        if (rules.indexOf(Rule.ALLOWED_INITIAL) >= 0) {
          const code = lastWord.charCodeAt(lastWord.length - 1) - 44032;
          const final = code % 28;
          let temp = String.fromCharCode(((code / 28) * 28) + 44032);

          switch (temp) {
            case '녀':
              temp = '여';
              break;
            case '뇨':
              temp = '요';
              break;
            case '뉴':
              temp = '유';
              break;
            case '니':
              temp = '이';
              break;
            case '랴':
              temp = '야';
              break;
            case '려':
              temp = '여';
              break;
            case '례':
              temp = '예';
              break;
            case '료':
              temp = '요';
              break;
            case '류':
              temp = '유';
              break;
            case '리':
              temp = '이';
              break;
            case '라':
              temp = '나';
              break;
            case '래':
              temp = '내';
              break;
            case '로':
              temp = '노';
              break;
            case '뢰':
              temp = '뇌';
              break;
            case '루':
              temp = '누';
              break;
            case '르':
              temp = '느';
              break;
          }

          if (String.fromCharCode(temp.charCodeAt(0) + final) !== word[0]) {
            throw new InvalidWordException();
          }
        } else {
          throw new InvalidWordException();
        }
      }
    }
    return true;
  }

  next(word) {
    const dictionaryObj = this.dictionary.getDictionaryObject();
    const history = this.history;
    if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
      if (this.isValidWord(word)) {
        const learning = this.learning;
        const level = this.level;
        const rules = this.rules;
        if (learning.getWordWeight(word[0]) > 0) {
          learning.setWordWeight(word[0], -5);
        }

        history.push(word);

        const wordsInfo = [];

        for (const i in dictionaryObj) {
          let check = true;
            // 끝말잇기
          const lastWord = history[history.length - 1];
          if (history.length > 0) {
            if (lastWord[lastWord.length - 1] !== i) {
                // 두음법칙
              if (rules.indexOf(Rule.ALLOWED_INITIAL) >= 0) {
                const code = lastWord.charCodeAt(lastWord.length - 1) - 44032;
                const final = code % 28;
                let temp = String.fromCharCode(((code / 28) * 28) + 44032);

                switch (temp) {
                  case '녀':
                    temp = '여';
                    break;
                  case '뇨':
                    temp = '요';
                    break;
                  case '뉴':
                    temp = '유';
                    break;
                  case '니':
                    temp = '이';
                    break;
                  case '랴':
                    temp = '야';
                    break;
                  case '려':
                    temp = '여';
                    break;
                  case '례':
                    temp = '예';
                    break;
                  case '료':
                    temp = '요';
                    break;
                  case '류':
                    temp = '유';
                    break;
                  case '리':
                    temp = '이';
                    break;
                  case '라':
                    temp = '나';
                    break;
                  case '래':
                    temp = '내';
                    break;
                  case '로':
                    temp = '노';
                    break;
                  case '뢰':
                    temp = '뇌';
                    break;
                  case '루':
                    temp = '누';
                    break;
                  case '르':
                    temp = '느';
                    break;
                }

                if (String.fromCharCode(temp.charCodeAt(0) + final) !== i) {
                  check = false;
                }
              } else {
                check = false;
              }
            }
          }

          if (check) {
            for (const j in dictionaryObj[i]) {
              try {
                if (this.isValidWord(j)) {
                  let score = level.getWordScore(j, dictionaryObj[i][j], history);
                  if (score > 0) {
                    score += learning.getWordWeight(j);
                  }
                  wordsInfo.push([j, score]);
                }
              } catch (e) {}
            }
          }
        }

        wordsInfo.sort((a, b) => {
          const c = b[1] - a[1];
          if (c === 0) {
            return (Math.random() * 10) - 5;
          }
          return c;
        });

        const nextWordInfo = wordsInfo[0];

        if (wordsInfo.length === 0 || nextWordInfo[1] === 0) {
          learning.setWordWeight(word[0], -10);
          this.history = [];
          return 'gg';
        }

        history.push(nextWordInfo[0]);

        return nextWordInfo[0];
      }
    } else if (word === 'gg' && history.length >= 1) {
      this.learning.setWordWeight(history[history.length - 1], 10);
    }
    return null;
  }
}

module.exports = WordChainer;
module.exports.WordChainer = WordChainer;
module.exports.Dictionary = Dictionary;

module.exports.LearningAI = LearningAI;

module.exports.WordException = WordException;
module.exports.ForbiddenWordException = ForbiddenWordException;
module.exports.InvalidWordException = InvalidWordException;
module.exports.NotFoundWordException = NotFoundWordException;
module.exports.UsedWordException = UsedWordException;

module.exports.Level = Level;
module.exports.EasyLevel = EasyLevel;
module.exports.NormalLevel = NormalLevel;
module.exports.HardLevel = HardLevel;
module.exports.InsaneLevel = InsaneLevel;

module.exports.Rule = Rule;
