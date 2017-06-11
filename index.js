const fs = require('fs');

const Dictionary = require('./lib/Dictionary');
const WordChainer = require('./lib/WordChainer');
const EasyLevelBehavior = require('./lib/level/EasyLevelBehavior');
const NormalLevelBehavior = require('./lib/level/NormalLevelBehavior');
const HardLevelBehavior = require('./lib/level/HardLevelBehavior');
const InsaneLevelBehavior = require('./lib/level/InsaneLevelBehavior');

const dictionary = new Dictionary('./dictionary/koreans.json');
const wordChainer = new WordChainer(dictionary, new EasyLevelBehavior());

const readline = require('readline');

let r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function battleWithMe() {
    r.setPrompt('> ');
    r.prompt();
    r.on('line', function (line) {
        if (line === 'exit') {
            r.close();
        }

        console.log(line);

        try {
            console.log(wordChainer.next(line));
        } catch (e) {
            console.log(e.toString());
        }

        r.prompt()
    });
    r.on('close', function () {
        process.exit();
    });
}

function showBotsBattle() {
    const wordChainer2 = new WordChainer(dictionary, new InsaneLevelBehavior());
    const history = [];

    let word = '과일';
    history.push('Start:' + word);

    try {
        while (1) {
            word = wordChainer.next(word);
            if (word === null) {
                break;
            }
            console.log('A:' + word);
            history.push('A:' + word);

            word = wordChainer2.next(word);
            if (word === null) {
                break;
            }
            console.log('B:' + word);
            history.push('B:' + word);
        }
    } catch (e) {
        console.log(e.toString());
    }

    fs.writeFileSync('output.txt', history.join('\n'));
}

showBotsBattle();