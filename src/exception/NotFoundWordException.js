import WordException from './WordException';

export default class NotFoundWordException extends WordException {
  constructor() {
    super();
    this.name = 'NotFoundWordException';
    this.message = 'Cannot find the word in the dictionary. Try another word!';
  }
}
