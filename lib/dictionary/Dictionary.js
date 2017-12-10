const fs = require('fs');

class Dictionary {
  constructor(path) {
    if (path) {
      this.dictionary = JSON.parse(fs.readFileSync(path));
    } else {
      this.dictionary = [];
    }
  }

  add(word) {
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      // text, type, theme
      this.dictionary.push([word.text, word.type, word.theme]);
    }
  }

  getAll(text) {
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      return this.dictionary.filter(value => value[0] === text);
    }
    return null;
  }

  has(text) {
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      return this.dictionary.some(value => value[0] === text);
    }
    return false;
  }

  openFromFile(path) {
    const str = fs.readFileSync(path);
    const buf = str.split('\n');
    this.dictionary = buf.map(value => value.split(','));
  }

  remove(word) {
    const { dictionary } = this;
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      for (let i = 0, len = dictionary.length; i < len; i += 1) {
        const wordObj = dictionary[i];
        if (word.text === wordObj[0]) {
          delete dictionary[i];
          break;
        }
      }
    }
  }

  saveAsFile(path) {
    console.log('saving');
    fs.writeFileSync(path, this.dictionary.map(value => value.join(',')).join('\n'));
    console.log('saved');
  }
}

module.exports = Dictionary;
