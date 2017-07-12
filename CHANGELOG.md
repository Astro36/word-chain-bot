# Changelog

## v0.4.0
Released July 13, 2017

### Changed
- ES6 syntax with Babel!
- Change some API on none-babel code:
```javascript
const chainer = require('word-chainer');

const bot = new chainer.WordChainer(chainer.EasyLevel);
```
- Change the command; `npm run test-helper`

## v0.3.1
Released July 11, 2017

### Fixed
- Fix a starting word bug.

## v0.3.0
Released July 10, 2017

### Added
- Add `Dictionary.getWordScore` method.
- Add `helper.js` for test.

### Changed
- Change the algorithm of the rule. Remove the classes and add an enum.

## v0.2.0
Released July 7, 2017

### Added
- Add LearningAI function to improve a bot intelligence. The AI will analyse your word pattern.

## v0.1.1
Released July 4, 2017

### Fixed
- Fix critical bug on finding a word dictionary path.

## v0.1.0
Released July 3, 2017

First Release