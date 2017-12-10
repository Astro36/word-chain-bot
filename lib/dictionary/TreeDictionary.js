const Dictionary = require('./Dictionary');

class TreeDictionary extends Dictionary {
  constructor(dictionary = []) {
    super(dictionary);
    this.createTreeDictionary(dictionary);
  }

  /**
   * @private
   */
  createTreeDictionary(dictionary) {
    const treeDictionary = {};
    for (let i = 0, len = dictionary.length; i < len; i += 1) {
      const word = dictionary[i];
      const [text] = word;
      if (text.length >= 2) {
        const startChar = text[0];
        const lastChar = text[text.length - 1];
        if (startChar in treeDictionary) {
          const treeDictionary2 = treeDictionary[startChar];
          if (lastChar in treeDictionary2) {
            treeDictionary2[lastChar].push(word);
          } else {
            treeDictionary2[lastChar] = [word];
          }
        } else {
          treeDictionary[startChar] = {
            [lastChar]: word,
          };
        }
      }
    }
    this.treeDictionary = treeDictionary;
  }

  add(word) {
    super.add(word);
    const { text } = word;
    const { treeDictionary } = this;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      // text, type, theme
      const startChar = text[0];
      const lastChar = text[text.length - 1];
      if (startChar in treeDictionary) {
        const treeDictionary2 = treeDictionary[startChar];
        if (lastChar in treeDictionary2) {
          treeDictionary2[lastChar].push([text, word.type, word.theme]);
        } else {
          treeDictionary2[lastChar] = [[text, word.type, word.theme]];
        }
      } else {
        treeDictionary[startChar] = {
          [lastChar]: [text, word.type, word.theme],
        };
      }
    }
  }

  has(text) {
    // Faster than Dictionary#has(text)
    const { treeDictionary } = this;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      const lastChar = text[text.length - 1];
      if (startChar in treeDictionary) {
        const treeDictionary2 = treeDictionary[startChar];
        if (lastChar in treeDictionary2) {
          return treeDictionary2[lastChar].some(value => value[0] === text);
        }
      }
    }
    return false;
  }

  openFromFile(path) {
    super.openFromFile(path);
    this.createTreeDictionary(this.dictionary);
  }

  removeAll(word) {
    super.removeAll(word);
    const { text } = word;
    const { treeDictionary } = this;
    if (/^[ㄱ-ㅎ가-힣]+$/.test(text)) {
      const startChar = text[0];
      const lastChar = text[text.length - 1];
      if (startChar in treeDictionary) {
        const treeDictionary2 = treeDictionary[startChar];
        if (lastChar in treeDictionary2) {
          const treeDictionary3 = treeDictionary2[lastChar];
          for (let i = 0, len = treeDictionary3.length; i < len; i += 1) {
            const wordObj = treeDictionary3[i];
            if (text === wordObj[0]) {
              treeDictionary3.splice(i, 1);
            }
          }
        }
      }
    }
  }
}

module.exports = TreeDictionary;
