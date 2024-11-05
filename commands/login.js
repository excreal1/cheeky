const { By, until } = require('selenium-webdriver');

async function runLoginTest(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://192.168.0.1');
        console.log('Navigated to the router login page.');

        // Wait for the login form to be loaded
        await driver.wait(until.elementLocated(By.id('focusUsername')), 10000);

        // Submit login form
        await driver.findElement(By.id('focusUsername')).sendKeys(''); // Add username if needed
        await driver.findElement(By.id('password_login')).sendKeys(''); // Add password if needed
        await driver.findElement(By.css('input[type="submit"]')).click();

        // Wait for the page to load after login
        await driver.wait(until.urlIs('http://192.168.0.1/Administration.asp'), 10000);
        console.log('Login successful and navigated to Administration page.');

    } catch (error) {
        console.error('Error during login test:', error);
    }
}

module.exports = runLoginTest;
