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

class AllowedCategoryRule extends FilterWordRule {
  constructor(...categories) {
    super('AllowedCategoryRule');
    if (categories) {
      if (categories.length === 1) {
        if (Array.isArray(categories)) {
          [this.categories] = categories;
        } else {
          this.categories = categories;
        }
      } else {
        this.categories = categories;
      }
    } else {
      this.categories = [];
    }
  }

  getCategories() {
    return this.categories;
  }

  isAvailable(word) {
    const category = word.getCategory();
    return category === null || this.categories.some(value => category.includes(value));
  }
}

module.exports = AllowedCategoryRule;
