const webdriver = require("selenium-webdriver");
const { Builder, Key, until } = webdriver;
const By = webdriver.By;

async function runSeleniumTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://www.python.org");

        let title = await driver.getTitle();
        if (!title.includes("Python")) {
            throw new Error('Title does not contain "Python"');
        }

        let elem = await driver.findElement(By.id("q"));
        await elem.clear();
        await elem.sendKeys("pycon");
        await elem.sendKeys(Key.RETURN);

        await driver.wait(until.titleContains("pycon"), 5000);

        let pageSource = await driver.getPageSource();
        if (pageSource.includes("No results found.")) {
            throw new Error('"No results found" is present in the page source');
        }

        let about = await driver.findElement(By.id("about"));
        await about.click();

        let downloads = await driver.findElement(
            By.xpath('//*[@id="downloads"]')
        );
        await downloads.click();

        await driver.takeScreenshot().then((image) => {
            const fs = require("fs");
            const path = require("path");
            const screenshotPath = path.join(__dirname, "downloads1.png");
            fs.writeFileSync(screenshotPath, image, "base64");
        });

        return title;
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    } finally {
        await driver.quit();
    }
}

module.exports = { runSeleniumTest };
