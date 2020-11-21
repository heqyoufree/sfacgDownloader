import axios from 'axios';
import axiosRetry from 'axios-retry';
import cheerio from 'cheerio';
import program from 'commander';
import he from 'he';

axiosRetry(axios, { retries: 100, shouldResetTimeout: true});
program
  .option('-i, --id <id>', 'book id')
  .version(require('./package.json').version)
  .parse();

class chapter {
  title: string;
  content: string;
  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
  decodeContent():string {
    return he.decode(this.content.replace(/<br>/g, '\n').replace(/<\/p>/g, '\n').replace(/<p>/g, '    '));
  }
  toString():string {
    return '\n--------------------\n'.concat(this.title,
      '\n--------------------\n',
      this.decodeContent())
  }
}

class book {
  bookname = '';
  author = '';
  chapters: chapter[] = [];
}
let count = 1;

console.log('getting index');
const download = new book();
axios.get(`https://m.sfacg.com/i/${program.id}/`).then((value) => {
  const _ = cheerio.load(value.data.toString());
  console.log(_('.mulu_list').find('a').length);
  _('.mulu_list').find('a').each((index, element) => {
    axios.get(`http://m.sfacg.com${_(element).attr('href')}`).then((value) => {
      const $ = cheerio.load(value.data.toString());
      $('.yuedu.Content_Frame').find('div').each((ind, ele) => {
        if(!$(ele).hasClass('yuedu_menu')) {
          const html = $(ele).html();
          html ? download.chapters[index] = new chapter($('ul.menu_top_list.book_view_top').find('li').eq(1).text(), html) : download.chapters[index] = new chapter('章节为空', '章节为空');
          console.log(count);
          console.log(($('.menu_top_list.book_view_top').find('li').eq(1).text()));
        }
        if (count === _('.mulu_list').find('a').length) {
          console.log(''.concat(...download.chapters.map<string>(ele => ele.toString())))
        }
      });
      count++;
    });
  });
});