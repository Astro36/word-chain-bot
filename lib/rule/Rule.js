class Rule {
    constructor() {
        this.name = 'Rule';
    }

    getValidWords(dictionary, word) {
        let lastChar = word[word.length - 1];
        if (lastChar in dictionary) {
            return dictionary[lastChar];
        }
        return {};
    }

    isValidWord(dictionary, word) {
        if (/^[ㄱ-ㅎ가-힣]{2,}$/.test(word)) {
            let startChar = word[0];
            if (startChar in dictionary) {
                return word in dictionary[startChar];
            }
        }
        return false;
    }
}

module.exports = Rule;