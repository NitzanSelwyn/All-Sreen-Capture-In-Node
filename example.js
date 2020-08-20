const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/firefox');
const fsp = require('fs');
const firefox = require('selenium-webdriver/firefox');
require('geckodriver');


(async function example() {
    let url = 'http://localhost:4200/mock-chart',
        options = new firefox.Options();

    // Set some conditions for the download manager
    options.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/pdf');
    options.setPreference('browser.download.folderList', 2);
    options.setPreference('browser.download.manager.showWhenStarting', false);
    options.setPreference('pdfjs.disabled', true);

    // Set the directory to save the exported file
    options.setPreference('browser.download.dir', __dirname);

    // Open the browser headless
    options.addArguments('-headless');

    let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    try {
        await driver.get(url);

        // getting the DOM size
        let height = await driver.executeScript(`return Math.max(document.body.scrollHeight,document.body.offsetHeight,
                document.documentElement.offsetHeight,document.documentElement.scrollHeight,document.documentElement.clientHeight)`);
        let width = await driver.executeScript(`return Math.max(document.body.scrollWidth,document.body.offsetWidth,
                    document.documentElement.offsetWidth,document.documentElement.scrollWidth,document.documentElement.clientWidth)`);

        const extraPixelOftest = 0 //there is an offset at the bottom of the page that the driver dosent consider

        //setting the window size to the size of the DOM
        driver.manage().window().setRect({ height: height + extraPixelOftest, width: width, x: 0, y: 0 }).then(async () => {
            //waiting till the title changes (client side will change the title once the page is fully loaded)
            await driver.wait(until.titleIs("BillboardClient"), 10000).then(async () => {
                takeScreenShot("test.png")
            })

            await driver.quit()
        })


        //takeing the screen shot
        function takeScreenShot(fileName) {
            driver.takeScreenshot().then(data => {
                fsp.writeFile(`c:\\temp\\${fileName}`, data, 'base64', err => {
                    if (err) throw err
                })
            })
        }

    } finally {
    }
})();
