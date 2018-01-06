# WordChainBot

> Korean Word Chain Bot

[![npm](https://img.shields.io/npm/v/word-chain-bot.svg?style=flat-square)](https://www.npmjs.com/package/word-chain-bot) [![npm](https://img.shields.io/npm/dt/word-chain-bot.svg?style=flat-square)](https://www.npmjs.com/package/word-chain-bot)

한국어 끝말잇기 봇

## ChangeLog

See [CHANGELOG](./CHANGELOG.md)

## Install

- Install with npm:

``` bash
npm install word-chain-bot --save
```

- Clone the repo:

``` bash
git clone https://github.com/Astro36/WordChainBot.git
```

## Usage

### Notice

**반드시 `data/`에 사전 DB를 넣어주세요.**

사전 DB는 아래와 같은 방법으로 크롤링 할 수 있습니다.

``` bash
npm install korean-dictionary --save
```

```javascript
const { KoreanDictionary } = require('korean-dictionary');
const dictionary = new KoreanDictionary('data/dictionary.sqlite3');
await dictionary.fetch();
```

### Example

```javascript
const readline = require('readline');

const { WordChainBot } = require('../lib');

(async () => {
  const bot = new WordChainBot('data/dictionary.sqlite3');
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
```

## Rule

이 규칙은 참가자와 봇 모두에게 기본적으로 적용되는 규칙입니다.

### 개요

앞 참가자가 입력한 단어의 마지막 글자로 시작하는 단어를 입력합니다. 차례는 한 사람이 패배할 때까지 반복됩니다. 자신의 차례에 단어를 입력하지 못하면 패배합니다.

```text
끝말잇기-기사-사과-과산화나트륨
```

### 사용 가능 단어

단어는 2글자 이상이어야 하며, 가~힣 사이의 글자 중 하나여야 합니다.

### 두음법칙

아래와 같은 두음 법칙을 인정합니다. 단, 역은 성립하지 않습니다.

- 녀 -> 여
- 뇨 -> 요
- 뉴 -> 유
- 니 -> 이
- 랴 -> 야
- 려 -> 여
- 례 -> 예
- 료 -> 요
- 류 -> 유
- 리 -> 이
- 라 -> 나
- 래 -> 내
- 로 -> 노
- 뢰 -> 뇌
- 루 -> 누
- 르 -> 느

## Custom Rule

### 명사만 사용 OnlyNounRule [Default]

명사만 사용할 수 있습니다.

### 전문어

특정 전문어 이외의 다른 단어의 사용을 금지합니다.

- 가톨릭
- 민속
- 의학
- 건설
- 법률
- 인명
- 경제
- 불교
- 전기
- 고적
- 사회
- 정치
- 고유
- 생물
- 종교
- 공업
- 수학
- 지리
- 광업
- 수산
- 지명
- 교육
- 수공
- 책명
- 교통
- 식물
- 천문
- 군사
- 심리
- 철학
- 기계
- 약학
- 출판
- 기독교
- 언론
- 컴퓨터
- 논리
- 언어
- 통신
- 농업
- 역사
- 한의학
- 동물
- 연영
- 항공
- 문학
- 예술
- 해양
- 물리
- 운동
- 화학
- 미술
- 음악

```javascript
const { OnlyThemeRule, WordChainBot } = require('word-chain-bot');
const bot = new WordChainBot('data/dictionary.sqlite3');
bot.addRule(new OnlyThemeRule(['물리', '화학'])); // 물리, 화학 이외의 전문어 사용을 금지합니다.
await bot.init();
```

## Level

봇의 난이도에 대한 설명입니다. 모든 사용자 규칙을 적용했을 때를 기준으로 합니다.

### Easy

쉬움 난이도입니다. 한방단어를 사용하지 않습니다. 반격하기 쉬운 단어를 사용합니다.

### Normal

보통 난이도입니다. 한방단어를 사용하지 않습니다.

### Hard

어려움 난이도입니다. 한방단어를 사용하지 않습니다. 반격하기 어려운 단어를 사용합니다.

### Insane

매우 어려움 난이도입니다. 반격하기 매우 어려운 단어를 사용합니다.

## License

```text
WordChainBot
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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

WordChainBot is licensed under the [GPL 3.0](./LICENSE).
