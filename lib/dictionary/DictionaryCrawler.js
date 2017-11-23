const jsdom = require('jsdom');
const request = require('request');
const { sleep } = require('sleep');

const { JSDOM } = jsdom;
const Dictionary = require('./Dictionary');

class DictionaryCrawler {
  static async run() {
    const dictionary = new Dictionary();
    let check = 520000;
    for (let i = 1; i < 520000; i += 1) {
      console.log(`${i} request`);
      request.get({ url: `http://stdweb2.korean.go.kr/search/View.jsp?idx=${i}`, gzip: true }, (error, response, body) => {
        if (body) {
          const { document } = (new JSDOM(body.split('\n').join('').match(/<div id="Result">(.+)/)[1])).window;
          const word = {};
          const textElement = document.querySelector('.pb10 .word_title font');
          check -= 1;
          if (textElement) {
            word.text = textElement.innerHTML.replace(/-|\^/g, '').trim();
            console.log(`${i} ${textElement.innerHTML}`);
          } else {
            return;
          }
          const classElement = document.querySelector('.list .NumRG font');
          if (classElement) {
            word.class = classElement.innerHTML.trim();
          } else {
            word.class = null;
          }
          const typeElement = document.querySelector('.list > font');
          if (typeElement) {
            word.type = typeElement.innerHTML.trim();
          } else {
            word.type = null;
          }
          const meaningElements = document.querySelectorAll('.list .exp .Definition font');
          if (meaningElements) {
            word.meaning = [];
            meaningElements.forEach((value) => {
              word.meaning.push(value.innerHTML.trim());
            });
          } else {
            word.meaning = null;
          }
          const exampleElement = document.querySelector('.list .exp font .Use');
          if (exampleElement) {
            word.example = exampleElement.innerHTML.replace(/<\/?b>/g, '').trim();
          } else {
            word.example = null;
          }
          dictionary.add(word);
          if (check === 1) {
            console.log('save');
            dictionary.saveAsFile('dictionary.json');
          }
        }
      });
    }
  }
}

DictionaryCrawler.run();

module.exports = DictionaryCrawler;
