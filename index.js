const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Google Visit Test', function() {
    this.timeout(20000);
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('should visit 192.168.0.5/Docsis_system.asp, fill in credentials, and press the login button', async function() {
        // Set variables for username and password
        const username = 'swdrftyu'; // Replace with actual username
        const password = 'tyhujikol'; // Replace with actual password

        await driver.get('http://192.168.0.5');
        console.log('Navigated to the page');
        await driver.wait(until.titleIs('Expected Title'), 20000);
        const title = await driver.getTitle();
        console.log('Page title:', title);
        assert.strictEqual(title, 'Expected Title');

        // Wait for the username field to be visible using full XPath
        const usernameField = await driver.wait(until.elementLocated(By.xpath('//*[@id="focusUsername"]')), 20000);
        await driver.wait(until.elementIsVisible(usernameField), 20000);
        await usernameField.sendKeys(username, Key.TAB); // Enter username and press TAB

        // Wait for the password field to be visible using full XPath
        const passwordField = await driver.wait(until.elementLocated(By.xpath('//*[@id="password_login"]')), 20000);
        await driver.wait(until.elementIsVisible(passwordField), 20000);
        await passwordField.sendKeys(password, Key.ENTER); // Enter password and press ENTER
    });

    after(async function() {
        await driver.quit();
    });
});
