const WordChainer = require('./WordChainer');
const EasyLevel = require('./level/EasyLevel');
const OnlyNounRule = require('./rule/OnlyNounRule');

class WordChainBot extends WordChainer {
  constructor(path, level = new EasyLevel(), rules = [new OnlyNounRule()]) {
    super(path, level, rules);
    this.lastWord = null;
  }

  async next(text) {
    return new Promise((resolve) => {
      if (text === 'gg') {
        resolve('패배...');
      } else if (text === '?') {
        resolve(this.lastWord.getMeaning().join('\n'));
      }
      super.next(text)
        .then((nextWord) => {
          if (nextWord) {
            this.lastWord = nextWord;
            resolve(nextWord.getText());
          }
          resolve('승리!');
        })
        .catch((e) => {
          resolve(e.message);
        });
    });
  }
}

module.exports = WordChainBot;
