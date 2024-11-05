const { Builder } = require('selenium-webdriver');
const runLoginTest = require('./commands/login');
const runDhcpCommand = require('./commands/dhcp');
const scrapeMacList = require('./commands/scrapeMacList');
const applyBlacklist = require('./commands/blacklist'); // Import the applyBlacklist function

async function main() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        // Perform login
        await runLoginTest(driver);

        // Handle command-line arguments
        const args = process.argv.slice(2);
        const command = args[0]; // Single command like 'dhcpenable', 'dhcpdisable', 'scrape', or 'blacklist'

        if (command === 'dhcpenable') {
            await runDhcpCommand(driver, 'enable'); // Enable DHCP server
        } else if (command === 'dhcpdisable') {
            await runDhcpCommand(driver, 'disable'); // Disable DHCP server
        } else if (command === 'scrape') {
            await scrapeMacList(driver); // Scrape MAC addresses and names
        } else if (command === 'blacklist') {
            await applyBlacklist(driver); // Apply blacklist from the database
        } else {
            console.error('Invalid command. Use "dhcpenable", "dhcpdisable", "scrape", or "blacklist".');
        }
    } catch (error) {
        console.error('Error during execution:', error);
    } finally {
        await driver.quit();
    }
}

main().catch(console.error);
