const puppeteer = require("puppeteer");
const search = require('./search');
const getConfig = require('./config');
const tools = require(`./tools`);

async function execute(searchTerm) {
  const configs = await getConfig();

  for (const config of configs) {
    const browser = await puppeteer.launch({ headless: true });

    const baseUrl = config.url.replace("@search", encodeURIComponent(searchTerm));

    let scripts = {};
    if (config.scripts)
      scripts = require(config.scripts);

    let pageUrls = [];
    if (scripts.getAllPages) {
      pageUrls = await scripts.getAllPages(baseUrl, config, browser);
    }
    if (pageUrls.length) {
      await executePages(config, pageUrls, browser);
    }
    else {
      await executeOnlyMainSearch(config, baseUrl, browser);
    }
  }
}

execute('batata').then(process.exit);

async function executeOnlyMainSearch(config, baseUrl, browser) {
  console.log(`${config.name} - paging could not be evaluated. Running simple search`);
  await search(baseUrl, config, browser);
}

async function executePages(config, pageUrls, browser) {
  console.log(`${config.name} - ${pageUrls.length} pages to evaluate`);
  for (let pageIndex = 0; pageIndex < pageUrls.length; pageIndex++) {
    const pageUrl = pageUrls[pageIndex];
    console.log(`${config.name} - searching page ${pageIndex + 1} of ${pageUrls.length}`);
    await search(pageUrl, config, browser);
  }
}
