import puppeteerCore from "puppeteer-core";

const browserlessToken = process.env.BROWSERLESS_TOKEN;

const scrapeWebURL = async ({ url }) => {
    let browser;
    try {
        browser = await puppeteerCore.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('body', { timeout: 5000 });

        const content = await page.content();
        await page.close();
        return content;
    } catch (error) {
        console.error("Scraping error:", error);
        return "";
    } finally {
        if (browser) await browser.close();
    }
};

export { scrapeWebURL };