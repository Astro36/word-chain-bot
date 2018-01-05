const FilterWordRule = require('./FilterWordRule');

class OnlyNounRule extends FilterWordRule {
  constructor() {
    super('OnlyNounRule', 'type LIKE "%명사%"');
  }
}

module.exports = OnlyNounRule;
