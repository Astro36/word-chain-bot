const WordChainer = require('../lib');

const bot = new WordChainer(new WordChainer.EasyLevel());
const bot2 = new WordChainer(new WordChainer.NormalLevel());

const history = [];

let word = '과일';
console.log('Start:' + word);
history.push('Start:' + word);

try {
    while (true) {
        word = bot.next(word);
        if (word === null) {
            break;
        }
        console.log('A:' + word);
        history.push('A:' + word);

        word = bot2.next(word);
        if (word === null) {
            break;
        }
        console.log('B:' + word);
        history.push('B:' + word);
    }
} catch (e) {
    console.log(e.toString());
}