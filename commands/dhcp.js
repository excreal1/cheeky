const { By, until } = require('selenium-webdriver');

async function runDhcpCommand(driver, action) {
    try {
        // Navigate to the LAN Setup page
        await driver.get('http://192.168.0.5/LanSetup.asp');
        console.log('Navigated to LAN Setup page.');

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.css('input[name="CiscoDhcpServer"]')), 10000);

        // Enable or disable DHCP based on the action
        if (action === 'enable') {
            await driver.findElement(By.id('CiscoDhcpServerenable')).click();
            console.log('DHCP Server enabled.');
        } else if (action === 'disable') {
            await driver.findElement(By.id('CiscoDhcpServerdisable')).click();
            console.log('DHCP Server disabled.');
        }

        // Submit the form if needed
        await driver.findElement(By.css('input[type="submit"]')).click();
        console.log('Submitted DHCP configuration.');

    } catch (error) {
        console.error('Error during DHCP command execution:', error);
    }
}

module.exports = runDhcpCommand;
