const WordChainBot = require('./WordChainBot');
const readline = require('readline');

(async () => {
  const bot = new WordChainBot();
  await bot.init();
  console.log('init');


  const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  r.setPrompt('You: ');
  r.prompt();
  r.on('line', async (line) => {
    if (line === 'exit' || line === 'gg') {
      r.close();
    }

    try {
      const next = await bot.next(line);
      if (next === null) {
        r.close();
      } else {
        console.log(`Bot: ${next}`);
      }
    } catch (e) {
      console.log(e.toString());
    }

    r.prompt();
  });
  r.on('close', () => {
    process.exit();
  });
})();
