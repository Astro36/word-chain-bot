const fs = require('fs');

class Dictionary {
  constructor(path) {
    if (path) {
      this.dictionary = JSON.parse(fs.readFileSync(path));
    } else {
      this.dictionary = {};
    }
  }

  add(word) {
    const { dictionary } = this;
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      if (startChar in dictionary) {
        if (text in dictionary[startChar]) {
          dictionary[startChar][text].push(word);
        } else {
          dictionary[startChar][text] = [word];
        }
      } else {
        dictionary[startChar] = {
          [text]: [word],
        };
      }
    }
  }

  get(text) {
    const { dictionary } = this;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      if (startChar in dictionary && text in dictionary[startChar]) {
        return dictionary[startChar][text];
      }
    }
    return null;
  }

  has(text) {
    const { dictionary } = this;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      return startChar in dictionary && text in dictionary[startChar];
    }
    return false;
  }

  remove(word) {
    const { dictionary } = this;
    const { text } = word;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      if (startChar in dictionary && text in dictionary[startChar]) {
        delete dictionary[startChar][text];
      }
    }
  }

  saveAsFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.dictionary));
  }
}

module.exports = Dictionary;
