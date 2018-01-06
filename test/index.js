const path = require('path');
const readline = require('readline');

const { WordChainBot } = require('../lib');

(async () => {
  const bot = new WordChainBot(path.join(__dirname, '../data/dictionary.sqlite3'));
  console.log('사전을 분석하는 중입니다.');
  await bot.init();

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

    const next = await bot.next(line);
    if (next === null) {
      r.close();
    } else {
      console.log(`Bot: ${next}`);
    }

    r.prompt();
  });
  r.on('close', () => {
    process.exit();
  });
})();
