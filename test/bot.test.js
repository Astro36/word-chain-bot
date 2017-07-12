const chainer = require('../lib/WordChainer');

const bot = new chainer.WordChainer(chainer.EasyLevel);

const readline = require('readline');

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r.setPrompt('You: ');
r.prompt();
r.on('line', (line) => {
  if (line === 'exit' || line === 'gg') {
    r.close();
  }

  try {
    const next = bot.next(line);
    console.log(`Bot: ${next}`);
    if (next === 'gg') {
      r.close();
    }
  } catch (e) {
    console.log(e.toString());
  }

  r.prompt();
});
r.on('close', () => {
  process.exit();
});
