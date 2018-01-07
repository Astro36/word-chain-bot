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

class AllowedPOSRule extends FilterWordRule {
  constructor(...poses) {
    if (poses && poses.length >= 1) {
      super('AllowedPOSRule', `(pos IS NULL OR ${poses.map(pos => `pos LIKE "%${pos}%"`).join(' OR ')})`);
    } else {
      super('AllowedPOSRule', '(pos IS NULL)');
    }
    this.poses = poses;
  }

  getPOSes() {
    return this.poses;
  }
}

module.exports = AllowedPOSRule;
