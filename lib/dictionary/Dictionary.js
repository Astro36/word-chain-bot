const fs = require('fs');

class Dictionary {
  constructor(dictionary = []) {
    this.dictionary = dictionary;
  }

  add(word) {
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      // text, type, theme
      this.dictionary.push([text, word.type, word.theme]);
    }
  }

  findAll(text) {
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      return this.dictionary.filter(value => value[0] === text);
    }
    return null;
  }

  getAll() {
    return this.dictionary;
  }

  has(text) {
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      return this.dictionary.some(value => value[0] === text);
    }
    return false;
  }

  openFromFile(path) {
    this.dictionary = fs.readFileSync(path).toString().split('\n').map(value => value.split(','));
  }

  removeAll(word) {
    const { dictionary } = this;
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      for (let i = 0, len = dictionary.length; i < len; i += 1) {
        const wordObj = dictionary[i];
        if (text === wordObj[0]) {
          dictionary.splice(i, 1);
        }
      }
    }
  }

  saveAsFile(path) {
    fs.writeFileSync(path, this.dictionary.map(value => value.join(',')).join('\n'));
    console.log('Dictionary Saved');
  }
}

module.exports = Dictionary;
