const { By, until } = require('selenium-webdriver');

async function runRestartCommand(driver) {
    try {
        // Navigate to the Device Restart page
        await driver.get('http://192.168.0.1/Devicerestart.asp');
        console.log('Navigated to Device Restart page.');

        // Wait for the restart button to be clickable
        const restartButton = await driver.wait(until.elementLocated(By.name('mtenRestore')), 10000);
        await driver.wait(until.elementIsVisible(restartButton), 10000);

        // Click the restart button
        await restartButton.click();
        console.log('Restart button clicked.');

        // Wait for the confirmation alert and accept it
        await driver.wait(until.alertIsPresent(), 10000);
        const alert = await driver.switchTo().alert();
        await alert.accept(); // Click "OK" on the confirmation alert
        console.log('Confirmation alert accepted.');

        // Wait for 15 seconds to allow the device to start the restart process
        await driver.sleep(15000);

        // Optionally, check for redirections
        await driver.wait(until.urlContains('some_expected_url_part'), 30000); // Replace with part of the expected URL after restart
        console.log('Successfully followed the redirection after restart.');

    } catch (error) {
        console.error('Error during restart command:', error);
    }
}

module.exports = runRestartCommand;
