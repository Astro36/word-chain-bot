export default class WordException {
  constructor() {
    this.name = 'WordException';
    this.message = 'Try another word!';
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}
