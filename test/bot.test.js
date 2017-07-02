const WordChainer = require('../lib');

const bot = new WordChainer(new WordChainer.EasyLevel());

const readline = require('readline');

let r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.setPrompt('You: ');
r.prompt();
r.on('line', function (line) {
    if (line === 'exit' || line === 'gg') {
        r.close();
    }

    try {
        let next = bot.next(line);
        console.log('Bot: ' + next);
        if (next === 'gg') {
            r.close();
        }
    } catch (e) {
        console.log(e.toString());
    }

    r.prompt();
});
r.on('close', function () {
    process.exit();
});