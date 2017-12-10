const cluster = require('cluster');
const jsdom = require('jsdom');
const request = require('request');
const numCPUs = require('os').cpus().length;

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
      const consonantWordCount = [65485, 17667, 31225, 9581, 26772, 39505, 55909, 69587, 50896, 19530, 5419, 9760, 12667, 28377];
      const urls = consonants.map((value, index) => {
        const arr = [];
        for (let i = 1, max = Math.floor(consonantWordCount[index] / 500) + 1; i <= max; i += 1) {
          arr.push(`http://stdweb2.korean.go.kr/search/List_dic.jsp?setJaso=${encodeURIComponent(value)}&PageRow=500&SearchPart=Index&go=${i}`);
        }
        return arr;
      }).reduce((valueA, valueB) => valueA.concat(valueB));
      const urlCount = urls.length;

      if (cluster.isMaster) {
        let idx = 0;
        for (let i = 0; i < numCPUs; i += 1) {
          cluster.fork().on('message', (message) => {
            for (const j in message.data.response) {
              dictionary.add(message.data.response[j]);
            }
            if (idx < urlCount) {
              console.log(idx);
              cluster.workers[message.data.id].send({
                type: 'request',
                data: {
                  id: message.data.id,
                  url: urls[idx],
                },
              });
            } else if (idx === urlCount + numCPUs - 1) {
              resolve(this.dictionary);
            }
            idx += 1;
          });
        }

        for (const id in cluster.workers) {
          cluster.workers[id].send({
            type: 'request',
            data: {
              id,
              url: urls[idx],
            },
          });
          idx += 1;
        }
      } else {
        process.on('message', (message) => {
          if (message.type === 'request') {
            console.log(message.data.url);
            request({ url: message.data.url, gzip: true }, (error, response, body) => {
              const words = [];
              if (body) {
                const html = body.split('\n').join('');
                const { document } = (new JSDOM(html.substring(html.search('<span id="print_area">'), html.search('<!-- paging.jsp --><table width="100%" border="0" cellspacing="0" cellpadding="0">')))).window;
                const elements = document.querySelectorAll('span#print_area p.exp');
                if (elements) {
                  for (let k = 0, len = elements.length; k < len; k += 1) {
                    const element = elements[k];
                    const text = element.querySelector('strong font').innerHTML;
                    if (text) {
                      const word = { text: text.trim().replace(/[-^]/g, '') };
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
                      words.push(word);
                    }
                  }
                }
              }
              process.send({
                data: {
                  id: message.data.id,
                  response: words,
                },
              });
            });
          }
        });
      }
    });
  }
}

(async () => { (await new DictionaryCrawler().run()).saveAsFile('dictionary.csv'); })();
module.exports = DictionaryCrawler;
