import Dictionary from './Dictionary';
import DictionaryAnalyzer from './DictionaryAnalyzer';
import Utils from './Utils';
import LearningAI from './ai/LearningAI';
import WordException from './exception/WordException';
import ForbiddenWordException from './exception/ForbiddenWordException';
import InvalidWordException from './exception/InvalidWordException';
import NotFoundWordException from './exception/NotFoundWordException';
import UsedWordException from './exception/UsedWordException';
import Level from './level/Level';
import EasyLevel from './level/EasyLevel';
import NormalLevel from './level/NormalLevel';
import HardLevel from './level/HardLevel';
import InsaneLevel from './level/InsaneLevel';
import Rule from './rule/Rule';

export default class WordChainer {
  constructor(level, name = 'test', rules = [Rule.ALLOWED_INITIAL]) {
    this.dictionary = Dictionary.getInstance(rules);
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
    if (history.includes(word)) {
      throw new UsedWordException();
    }

    // 사전
    const startChar = word[0];
    if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
      // 특수단어
      if (dictionaryObj[startChar][word].theme.filter(element => ['THE iDOLM@STER', 'VOCALOID', '개구리 중사 케로로', '국내 방송 프로그램', '니세코이', '대한민국 철도역', '도타 2', '듀라라라!!', '디지몬', '라면/과자', '러브 라이브!', '리그 오브 레전드', '마법소녀 리리컬 나노하', '마법소녀 마도카☆마기카', '메이플스토리', '메카쿠시티 액터즈', '모노가타리 시리즈', '모바일 게임', '빙과', '사이퍼즈', '스즈미야 하루히', '스타크래프트', '신조어', '아지랑이 프로젝트', '앙상블 스타즈!', '엘소드', '오레이모', '오버워치', '온라인 게임', '외국 영화', '월드 오브 워크래프트', '유루유리', '유명인', '라이트 노벨', '만화/애니메이션', '젤다의 전설', '포켓몬스터', '하이큐!!', '하스스톤', '한국 영화', '함대 컬렉션', '히어로즈 오브 더 스톰'].includes(element)).length > 0 && !rules.includes(Rule.ALLOWED_EXTRA)) {
        throw new NotFoundWordException();
      }
      // 매너
      if (dictionaryObj[startChar][word].start <= 5 && rules.includes(Rule.MANNER)) {
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
        if (rules.includes(Rule.ALLOWED_INITIAL)) {
          if (Utils.convertInitialSound(lastWord[lastWord.length - 1]) !== word[0]) {
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
              if (rules.includes(Rule.ALLOWED_INITIAL)) {
                if (Utils.convertInitialSound(lastWord[lastWord.length - 1]) !== i) {
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
          if (history.length >= 2) {
            const lastWord = history[history.length - 2];
            learning.setWordWeight(lastWord[lastWord.length - 1], -10);
          }
          this.history = [];
          return 'gg';
        }

        history.push(nextWordInfo[0]);

        return nextWordInfo[0];
      }
    } else if (word.toLowerCase() === 'gg' && history.length >= 1) {
      this.learning.setWordWeight(history[history.length - 1], 10);
    }
    return null;
  }
}

export { WordChainer, Dictionary, DictionaryAnalyzer, Utils, LearningAI, WordException, ForbiddenWordException, InvalidWordException, NotFoundWordException, UsedWordException, Level, EasyLevel, NormalLevel, HardLevel, InsaneLevel, Rule };
