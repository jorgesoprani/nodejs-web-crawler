const puppeteer = require("puppeteer");
const fs = require('fs');

const search = async (searchTerm, options) => {
    console.log(`Executing search on: ${options.name}: ${searchTerm}`)
    const searchUrl = options.url;
  
    const browser = await puppeteer.launch({ headless: true });
  
    const page = await browser.newPage();
    await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36`);
  
    const finalUrl = searchUrl.replace("@search", encodeURIComponent(searchTerm));
    console.log(finalUrl);
    await page.goto(finalUrl, {
      waitUntil: "networkidle0",
    });
    
    let scripts = {};
    if (options.scripts)
      scripts = require(options.scripts);
  
    if (scripts.preSearch) {
      const a = await page.evaluate(scripts.preSearch);
      console.log(a);
    }
  
    const result = await page.evaluate((options) => {
      const allResults = {};
      try {
  
        const nodeList = [
          ...document.querySelectorAll(options.selectors.parent),
        ];
  
        const result = [];
        for (const node of nodeList) {
          const obj = {};
          const props = options.selectors.props;
          for (const prop of Object.keys(props)) {
            const propNode = node.querySelector(props[prop].selector);
            if (propNode) {
              const propValue = propNode[props[prop]?.propName];
              obj[prop] = propValue;
            } else {
              obj[prop] = null;
            }
          }
          result.push(obj);
        }
        allResults[options.name] = result;
      } catch (error) {
        return error;
        console.log(error);
      }
      return allResults;
    }, options);
  
    let originalData = {};
    fs.readFile('C:\\Temp\\teste.json', async (err, data) => {
      if (data) {
        try {
          originalData = JSON.parse(data);
        } catch (error) {
          console.log(error);
        }
      }
  
      const jsonData = JSON.stringify(Object.assign(originalData, result), null, 2);
      fs.writeFile('C:\\Temp\\teste.json', jsonData, (err) => {
        if (err) throw err;
        console.log('Data written to file: ' + options.name);
      });
    });
  
  };

  module.exports = search;