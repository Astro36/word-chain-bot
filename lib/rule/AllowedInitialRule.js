const Rule = require('./Rule');

class AllowedInitialRule extends Rule {
    constructor() {
        super();
        this.name = 'AllowedInitialRule';
    }

    getValidWords(dictionary, word) {
        let code = word.charCodeAt(word.length - 1) - 44032,
            final = code % 28,
            temp = String.fromCharCode(~~(code / 28) * 28 + 44032);

        switch (temp) {
        case "녀":
            temp = "여";
            break;
        case "뇨":
            temp = "요";
            break;
        case "뉴":
            temp = "유";
            break;
        case "니":
            temp = "이";
            break;
        case "랴":
            temp = "야";
            break;
        case "려":
            temp = "여";
            break;
        case "례":
            temp = "예";
            break;
        case "료":
            temp = "요";
            break;
        case "류":
            temp = "유";
            break;
        case "리":
            temp = "이";
            break;
        case "라":
            temp = "나";
            break;
        case "래":
            temp = "내";
            break;
        case "로":
            temp = "노";
            break;
        case "뢰":
            temp = "뇌";
            break;
        case "루":
            temp = "누";
            break;
        case "르":
            temp = "느";
            break;
        }

        let lastChar = String.fromCharCode(temp.charCodeAt(0) + final);

        if (lastChar !== word[word.length - 1]) {
            if (lastChar in dictionary) {
                return dictionary[lastChar];
            }
        }
        return {};
    }
}

module.exports = Rule;