const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
  const searchUrl = "https://www.americanas.com.br/busca/@search";
  const searchTerm = "batata";

  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36`);

  // await page.setViewport({
  //   height: 768,
  //   width: 1366
  // });
  const finalUrl = searchUrl.replace("@search", encodeURIComponent(searchTerm));
  console.log(finalUrl);
  await page.goto(finalUrl, {
    waitUntil: "networkidle0",
  });

  await page.evaluate(() => document.querySelector('#lgpd-accept')?.click());

  const options = {
    selectors: {
      product: {
        parent: '[class*="src__ColGridItem"]',
        props: {
          image: {
            selector: '[class*="src__WrapperPicture"] img',
            propName: "src",
          },
          name: {
            selector: '[class*="src__Name"]',
            propName: "textContent",
          },
          link: {
            selector: '[class*="src__Wrapper"] > a',
            propName: "href",
          },
          price: {
            selector: 'span[class*="src__PromotionalPrice"]',
            propName: "textContent",
          },
        },
      },
    },
  };
  const pageData = await page.evaluate(() => document.querySelector('*').outerHTML);

  fs.writeFile('C:\\Temp\\page.html', pageData, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  const result = await page.evaluate((options) => {
    const allResults = [];
    try {

      for (const selector of Object.keys(options.selectors)) {
        const nodeList = [
          ...document.querySelectorAll(options.selectors[selector].parent),
        ];
        //   return options.selectors[selector].parent;
        const result = [];
        for (const node of nodeList) {
          console.log(node);
          const obj = {};
          const props = options.selectors[selector].props;
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
        allResults.push({ [selector]: result });
      }
    } catch (error) {
      console.log(error);
    }
    return allResults;
  }, options);

  // console.log(result);

  const data = JSON.stringify(result, null, 2);

  fs.writeFile('C:\\Temp\\teste.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  // await browser.close();
})();
