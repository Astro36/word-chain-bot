const Rule = require('./Rule');

class AllowedExtraWordRule extends Rule {
    constructor(extras = []) {
        super();
        this.name = 'AllowedExtraWordRule';
        this.extras = extras;
    }

    isExistedWord(dictionaryObj, word, history) {
        let startChar = word[0];
        if ((startChar in dictionaryObj) && (word in dictionaryObj[startChar])) {
            let extra = dictionaryObj[startChar][word].extra,
                extras = this.extras;
            return extra.length === 0 || extra.every(element => extras.indexOf(element));
        } else {
            return false;
        }
    }
}

module.exports = AllowedExtraWordRule;