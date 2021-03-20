module.exports = {
    openPage: async (browser, url) => {
        browser = browser || (await puppeteer.launch({ headless: true }));
        const page = await browser.newPage();
        await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36`);
        await page.goto(url, {
            waitUntil: "networkidle0",
        });

        return {
            browser,
            page
        };
    }
};