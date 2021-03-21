const puppeteer = require("puppeteer");
const search = require('./search');
const getConfig = require('./config');
const tools = require(`./tools`);
const ExcelOutput = require("./excelOutput");

async function execute(searchTerm) {
  const configs = await getConfig();
  const outputProvider = new ExcelOutput();

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
      await executePages(config, pageUrls, browser, outputProvider);
    }
    else {
      await executeOnlyMainSearch(config, baseUrl, browser, outputProvider);
    }

    await outputProvider.save();
  }
}

execute('batata').then(process.exit);

async function executeOnlyMainSearch(config, baseUrl, browser, outputProvider) {
  console.log(`${config.name} - paging could not be evaluated. Running simple search`);
  await search(baseUrl, config, browser, outputProvider);
}

async function executePages(config, pageUrls, browser, outputProvider) {
  console.log(`${config.name} - ${pageUrls.length} pages to evaluate`);
  for (let pageIndex = 0; pageIndex < pageUrls.length; pageIndex++) {
    const pageUrl = pageUrls[pageIndex];
    console.log(`${config.name} - searching page ${pageIndex + 1} of ${pageUrls.length}`);
    await search(pageUrl, config, browser, outputProvider);
  }
}
