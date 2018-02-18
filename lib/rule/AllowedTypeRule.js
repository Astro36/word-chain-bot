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

const FilterWordRule = require('./FilterWordRule');

class AllowedTypeRule extends FilterWordRule {
  constructor(...types) {
    super('AllowedTypeRule');
    if (types) {
      if (types.length === 1) {
        if (Array.isArray(types)) {
          [this.types] = types;
        } else {
          this.types = types;
        }
      } else {
        this.types = types;
      }
    } else {
      this.types = [];
    }
  }

  getTypes() {
    return this.types;
  }

  isAvailable(word) {
    const type = word.getType();
    return type === null || this.types.some(value => type.includes(value));
  }
}

module.exports = AllowedTypeRule;
