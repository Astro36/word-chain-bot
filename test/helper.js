const WordChainer = require('../lib/WordChainer');

const dictionary = WordChainer.Dictionary.getInstance().getDictionaryObject();

const readline = require('readline');

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r.setPrompt('Last Character: ');
r.prompt();
r.on('line', (line) => {
  if (line === 'exit') {
    r.close();
  }

  const char = line[0];
  const words = [];

  for (const i in dictionary[char]) {
    words.push([i, WordChainer.Level.getWordScore(i, dictionary[char][i], [])]);
  }

  words.sort((a, b) => b[1] - a[1]);

  for (const i in words) {
    words[i] = `${words[i][0]} ${words[i][1]}`;
  }

  console.log(words.join('\n'));

  r.prompt();
});
r.on('close', () => {
  process.exit();
});
