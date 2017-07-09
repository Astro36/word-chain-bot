const WordChainer = require('../lib/WordChainer');

const dictionary = WordChainer.Dictionary.getInstance().getDictionaryObject();

const readline = require('readline');

let r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.setPrompt('Last Character: ');
r.prompt();
r.on('line', function (line) {
    if (line === 'exit') {
        r.close();
    }

    let level = new WordChainer.Level(),
        char = line[0],
        words = [];

    for (let i in dictionary[char]) {
        words.push([i, level.getWordScore(i, dictionary[char][i], [])]);
    }

    words.sort((a, b) => b[1] - a[1]);

    for (let i in words) {
        words[i] = words[i][0] + ' ' + words[i][1];
    }
    
    console.log(words.join('\n'));

    r.prompt();
});
r.on('close', function () {
    process.exit();
});