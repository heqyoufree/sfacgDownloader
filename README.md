# sfacgDownloader
## Build
1. [Pre-built js](https://github.com/heqyoufree/sfacgDownloader/releases)
2. Build by yourself
```bash
yarn install
tsc #need package typescript to be installed
```
## Usage
Usage: node index.js [options]  
  
Options:  
  -i, --id <id>  book id  
  -V, --version  output the version number  
  -h, --help     display help for command  
  
Example:
  Book link:http://book.sfacg.com/Novel/381907/
  To download, run node index.js -i 381907
