import fs from 'fs';
import path from 'path';

let instance;

export default class Dictionary {
  constructor() {
    this.dictionaryObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../dictionary/koreans_noun.min.json'), 'utf8'));
  }

  static getInstance() {
    if (!instance) {
      return (instance = new Dictionary());
    }
    return instance;
  }

  getDictionaryObject() {
    return this.dictionaryObj;
  }

  getWordInfo(word) {
    if (word[0] in this.dictionaryObj && word in this.dictionaryObj[word[0]]) {
      return this.dictionaryObj[word[0]][word];
    }
    return -1;
  }
}
