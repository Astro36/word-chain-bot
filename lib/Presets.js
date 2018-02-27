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

const Defaults = require('./Defaults');
const NormalLevel = require('./level/NormalLevel');
const ScoreWordRule = require('./rule/ScoreWordRule');

const createCategoryScoreRules = (...categories) => categories.map(category => new ScoreWordRule({ category }, 1));

const createPreset = (rules = []) => {
  const ruleClasses = rules.map(value => value.constructor);
  return {
    level: new NormalLevel(),
    rules: Defaults.rules.filter(defaultRule => ruleClasses.every(ruleClass => !(defaultRule instanceof ruleClass))).concat(rules),
  };
};

module.exports = {
  Experts: {
    artist: createPreset(createCategoryScoreRules('문학', '미술', '예술', '음악')),
    builder: createPreset(createCategoryScoreRules('건설', '공업')),
    cleric: createPreset(createCategoryScoreRules('가톨릭', '기독교', '불교')),
    doctor: createPreset(createCategoryScoreRules('생물', '약학', '의학', '한의학')),
    engineer: createPreset(createCategoryScoreRules('기계', '물리', '전기', '화학')),
    humanities: createPreset(createCategoryScoreRules('경제', '교육', '법률', '언어', '역사', '정치')),
    programmer: createPreset(createCategoryScoreRules('전기', '컴퓨터', '통신')),
  },
};
