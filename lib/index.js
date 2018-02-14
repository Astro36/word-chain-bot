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

const ConsoleWordChainBot = require('./bot/ConsoleWordChainBot');
const AlreadyUsedWordError = require('./exception/AlreadyUsedWordError');
const NotExistWordError = require('./exception/NotExistWordError');
const TooShortWordError = require('./exception/TooShortWordError');
const UnavailableWordError = require('./exception/UnavailableWordError');
const WordError = require('./exception/WordError');
const EasyLevel = require('./level/EasyLevel');
const HardLevel = require('./level/HardLevel');
const InsaneLevel = require('./level/InsaneLevel');
const Level = require('./level/Level');
const NormalLevel = require('./level/NormalLevel');
const AllowedCategoryRule = require('./rule/AllowedCategoryRule');
const AllowedPOSRule = require('./rule/AllowedPOSRule');
const AllowedTypeRule = require('./rule/AllowedTypeRule');
const AllowInitialSoundRule = require('./rule/AllowInitialSoundRule');
const FilterWordRule = require('./rule/FilterWordRule');
const Rule = require('./rule/Rule');
const Utils = require('./Utils');
const Word = require('./Word');
const WordChain = require('./WordChain');
const WordChainBot = require('./WordChainBot');

module.exports = {
  ConsoleWordChainBot,
  AlreadyUsedWordError,
  NotExistWordError,
  TooShortWordError,
  UnavailableWordError,
  WordError,
  EasyLevel,
  HardLevel,
  InsaneLevel,
  Level,
  NormalLevel,
  AllowedCategoryRule,
  AllowedPOSRule,
  AllowedTypeRule,
  AllowInitialSoundRule,
  FilterWordRule,
  Rule,
  Utils,
  Word,
  WordChain,
  WordChainBot,
};
