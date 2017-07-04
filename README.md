# WordChainerJS
[![npm](https://img.shields.io/npm/v/word-chainer.svg)](https://github.com/Astro36/WordChainerJS)
[![npm](https://img.shields.io/npm/dt/word-chainer.svg)](https://github.com/Astro36/WordChainerJS)
[![npm](https://img.shields.io/npm/l/word-chainer.svg)](https://github.com/Astro36/WordChainerJS)

Korean Word Chainer Bot

## Install
``` bash
npm install word-chainer
```
``` bash
git clone https://github.com/Astro36/WordChainerJS.git
```

## Usage
```javascript
const WordChainer = require('word-chainer');

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
```

## License
WordChainerJS is licensed under the [GPL 3.0](./LICENSE).

[dp.sql](https://github.com/JJoriping/KKuTu/blob/master/db.sql) for Korean word database is licensed under an [GPL-3.0](https://raw.githubusercontent.com/JJoriping/KKuTu/master/LICENSE) by JJoriping.