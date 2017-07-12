import WordException from './WordException';

export default class UsedWordException extends WordException {
  constructor() {
    super();
    this.name = 'UsedWordException';
    this.message = 'The word is already used. Try another word!';
  }
}
