import fs from 'fs';
import path from 'path';
import DictionaryAnalyzer from './DictionaryAnalyzer';
import Rule from './rule/Rule';

const instances = {};

export default class Dictionary {
  constructor(rules = [Rule.ALLOWED_INITIAL]) {
    this.dictionaryObj = new DictionaryAnalyzer(JSON.parse(fs.readFileSync(path.join(__dirname, '../dictionary/koreans_noun.min.json'), 'utf8'))).run(rules);
  }

  static getInstance(rules = [Rule.ALLOWED_INITIAL]) {
    const key = rules.sort().join('');
    if (key in instances) {
      return instances[key];
    }
    instances[key] = new Dictionary(rules);
    return instances[key];
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
