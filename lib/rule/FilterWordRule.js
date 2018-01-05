const Rule = require('./Rule');

class FilterWordRule extends Rule {
  constructor(name, sql) {
    super(`FilterWordRule>${name}`);
    this.sql = sql;
  }

  getSQL() {
    return this.sql;
  }

  toJSON() {
    return `${this.getName()}:${this.sql}`;
  }
}

module.exports = FilterWordRule;
