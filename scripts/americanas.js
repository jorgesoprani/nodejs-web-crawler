const tools = require('../tools');

module.exports = {
    preSearch: () => {
        document.querySelector('#lgpd-accept')?.click()
        return 'teste';
    },
    getAllPages: async (baseUrl, config, browser) => {
        const { page } = await tools.openPage(browser, baseUrl)

        const pageUrls = await page.evaluate((config, url) => {
            const maxPages = config.maxPages || 10000;
            const totalItems = Number(document.querySelector(`[class*='full-grid__TotalText']`).innerText.split(' ')[0].replace('.', '')) / 50;

            const numberOfPages = Math.min(maxPages, Math.ceil(totalItems / 50));
            const pageUrls = [];
            for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
                const pageUrl = `${url}?limit=50&offset=${(pageNumber - 1) * 50}`;
                pageUrls.push(pageUrl);
            }
            return pageUrls;
        }, config, baseUrl);

        await page.close();

        return pageUrls;
    }
}