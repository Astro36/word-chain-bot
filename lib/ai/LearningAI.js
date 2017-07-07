const fs = require('fs');
const path = require('path');

class LearningAI {
    constructor(name = 'test') {
        this.path = path.join(__dirname, '../../data/learnings-' + name + '.json');
        if (fs.existsSync(this.path)) {
            this.learningObj = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        } else {
            let dirPath = path.join(this.path, '../');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            this.learningObj = {};
        }
    }

    getLearningObject() {
        return this.learningObj;
    }

    getWordWeight(word) {
        word = word[word.length - 1];
        if (word in this.learningObj) {
            return this.learningObj[word];
        }
        return 0;
    }

    hasWord(word) {
        return word in this.learningObj;
    }

    setWordWeight(word, weight) {
        word = word[word.length - 1];
        if (!(word in this.learningObj)) {
            this.learningObj[word] = 0;
        }
        this.learningObj[word] += weight;

        if (this.learningObj[word] > 50) {
            this.learningObj[word] = 50;
        } else if (this.learningObj[word] < -50) {
            this.learningObj[word] = -50;
        }

        if (this.learningObj[word] === 0) {
            delete this.learningObj[word];
        }
        fs.writeFileSync(this.path, JSON.stringify(this.learningObj));
    }
}

module.exports = LearningAI;