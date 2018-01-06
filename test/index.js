/* WordChainBot
Copyright (C) 2017  Astro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

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
