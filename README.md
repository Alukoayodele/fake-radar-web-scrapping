# fake-radar-web-scrapping

A simplified version of Radar a software that was built to check clients’ websites to understand if they are compliant with different regulation laws, like
GDPR.

---
## Requirements

For development, you will only need Node.js and a node global package.

## Install

    $ git clone https://github.com/Alukoayodele/fake-radar-web-scrapping.git
    $ cd fake-radar-web-scrapping
    $ npm install


## Running the project

    $ node index process.argv[2]   
    Example: node index https://www.acmilan.com/it   
    
## Duration
  
  The logic around the code took about 4 hours, but the initial research around the use of Puppeteer took a little longer.
  I initially used the English terms and conditions list to test the application but while testing with the other languages i discovered the initial 
  method i was using wasn't consistent so it was not passing for other languages.
    
    
