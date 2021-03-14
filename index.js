const puppeteer = require("puppeteer");

(async () => {
  const searchUrl = "https://www.americanas.com.br/busca/@search";
  const searchTerm = "batata";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const finalUrl = searchUrl.replace("@search", encodeURIComponent(searchTerm));
  console.log(finalUrl);
  await page.goto(finalUrl, {
    waitUntil: "networkidle0",
  });

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
          link: {
            selector: '[class*="src__PromotionalPrice"] > a',
            propName: "textContent",
          },
        },
      },
    },
  };

  const result = await page.evaluate((options) => {
    const allResults = [];
    for (const selector of Object.keys(options.selectors)) {
      const nodeList = [
        ...document.querySelectorAll(options.selectors[selector].parent),
      ];
      return document.getElementsByTagName('body')[0].innerHTML;

      //   return options.selectors[selector].parent;
      const result = [];
      for (const node of nodeList) {
        const obj = {};
        const props = options.selectors[selector].props;
        for (const prop of Object.keys(props)) {
          const propNode = node.querySelector(props[prop].selector);
          const propValue = propNode[props[prop].propName];
          obj[prop] = propValue;
        }
        result.push(obj);
      }
      allResults.push({ [selector]: result });
    }
    return allResults;
  }, options);

  console.log(result);

  await browser.close();
})();
