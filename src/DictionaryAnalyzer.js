import Utils from './Utils';
import Rule from './rule/Rule';

export default class DictionaryAnalyzer {
  constructor(dictionaryObj) {
    this.dictionaryObj = dictionaryObj;
  }

  run(rules = [Rule.ALLOWED_INITIAL]) {
    if (this.dictionaryObj) {
      const dictionaryObj = this.dictionaryObj;
      const dictionaryObjLast = {}; // 끝 단어로 묶은 객체
      const dangerWords = []; // 한방단어
      const starts = {};
      const chains = {};

      function getChain(word, chain) {
        const startChar = word[0];
        chain++;
        chains[startChar] = chain;
        if (chain < 21) {
          for (const i in dictionaryObjLast[startChar]) {
            const word2 = dictionaryObjLast[startChar][i];
            if (!(word2[0] in chains)) {
              getChain(word2, chain);
            }
          }
        }
      }

      for (const startChar in dictionaryObj) {
        const size = Object.keys(dictionaryObj[startChar]).length;
        if (size === 0) {
          delete dictionaryObj[startChar];
        } else {
          for (const word in dictionaryObj[startChar]) {
            const lastChar = word[word.length - 1];
            if (!(lastChar in dictionaryObj)) {
              dangerWords.push(word);
            }
            if (!(lastChar in dictionaryObjLast)) {
              dictionaryObjLast[lastChar] = [];
            }
            dictionaryObjLast[lastChar].push(word);
          }
          starts[startChar] = size;
        }
      }

      for (const i in dangerWords) {
        const word = dangerWords[i];
        const lastChar = word[word.length - 1];
        chains[lastChar] = 1;
        getChain(word, 1);
      }

      if (rules.includes(Rule.ALLOWED_INITIAL)) {
        for (const startChar in chains) {
          const char = Utils.convertInitialSound(startChar);
          if (char !== startChar && char in chains) {
            chains[startChar] = Math.max(chains[char], chains[startChar]);
          }
        }
      }

      for (const startChar in dictionaryObj) {
        for (const word in dictionaryObj[startChar]) {
          const lastChar = word[word.length - 1];
          dictionaryObj[startChar][word].start = starts[lastChar];
          dictionaryObj[startChar][word].chain = chains[lastChar];
        }
      }

      return dictionaryObj;
    }
    return null;
  }
}
