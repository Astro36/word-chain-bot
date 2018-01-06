class WordError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

module.exports = WordError;
