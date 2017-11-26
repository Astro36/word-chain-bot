const jsdom = require('jsdom');
const request = require('request');

const { JSDOM } = jsdom;
const Dictionary = require('./Dictionary');

class DictionaryCrawler {
  constructor(dictionary = new Dictionary()) {
    this.dictionary = dictionary;
  }

  async run() {
    return new Promise((resolve) => {
      const { dictionary } = this;
      const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
      const cralwerCount = [6, 2, 4, 1, 3, 4, 6, 7, 6, 2, 1, 1, 2, 3];
      let check = 0;
      for (let i = 0; i < 14; i += 1) {
        for (let j = 1, max = cralwerCount[i]; j <= max; j += 1) {
          console.log(`request ${consonants[i]}(${j})`);
          request({ url: `http://stdweb2.korean.go.kr/search/List_dic.jsp?setJaso=${encodeURIComponent(consonants[i])}&PageRow=10000&SearchPart=Index&go=${j}`, gzip: true }, (error, response, body) => {
            if (body) {
              const html = body.split('\n').join('');
              const { document } = (new JSDOM(html.substring(html.search('<span id="print_area">'), html.search('<!-- paging.jsp --><table width="100%" border="0" cellspacing="0" cellpadding="0">')))).window;
              const elements = document.querySelectorAll('span#print_area p.exp');
              if (elements) {
                for (let k = 0, len = elements.length; k < len; k += 1) {
                  const element = elements[k];
                  const text = element.querySelector('strong font').innerHTML;
                  if (text) {
                    const word = { text: text.trim() };
                    const content = element.innerHTML;
                    const type = content.match(/「<font face="새굴림" style="font-size:13px">([ㄱ-ㅎ가-힣]+)<\/font>」/);
                    const theme = content.match(/『<font face="새굴림" style="font-size:13px">([ㄱ-ㅎ가-힣]+)<\/font>』/);
                    if (type) {
                      word.type = type[1].trim();
                    } else {
                      word.type = null;
                    }
                    if (theme) {
                      word.theme = theme[1].trim();
                    } else {
                      word.theme = null;
                    }
                    dictionary.add(word);
                  }
                }
              }
            }
            check += 1;
            console.log(`complete ${check}/48`);
            if (check === 48) {
              resolve(dictionary);
            }
          });
        }
      }
    });
  }
}
(async () => { (await new DictionaryCrawler().run()).saveAsFile('dictionary.json'); })();
module.exports = DictionaryCrawler;
