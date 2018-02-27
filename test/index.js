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

const { KoreanDictionary } = require('korean-dictionary');
const path = require('path');
const readline = require('readline');

const { ConsoleWordChainBot } = require('../lib');

(async () => {
  const dictionary = new KoreanDictionary(path.join(__dirname, '../data/dictionary.sqlite3'));
  const bot = new ConsoleWordChainBot(dictionary);
  console.log('사전을 분석하는 중입니다.');
  await bot.init();
  console.log('게임을 시작합니다.');

  const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  r.setPrompt('You: ');
  r.prompt();
  r.on('line', async (line) => {
    if (line === 'exit' || line === 'gg') {
      r.close();
    } else {
      const next = bot.next(line);
      console.log(`Bot: ${next}`);
      if (next === '승리!') {
        r.close();
      }
    }
    r.prompt();
  });
  r.on('close', () => {
    process.exit();
  });
})();
