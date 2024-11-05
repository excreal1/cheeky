const { MongoClient } = require('mongodb');
const { By, until } = require('selenium-webdriver');

async function applyBlacklist(driver) {
    const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI if different
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db("cheeky");
        const blacklistCollection = db.collection("blacklist");

        // Navigate to the Wireless Client MAC List page
        await driver.get('http://192.168.0.1/WMACFilter.asp');
        console.log('Navigated to Wireless Client MAC List page.');

        // Assuming MAC filter is already enabled
        console.log('MAC filter is assumed to be already enabled.');

        // Wait for the table to be present
        await driver.wait(until.elementLocated(By.css('.popTable_wmac')), 15000);
        console.log('Wireless Client MAC List table located.');

        // Clear all existing MAC addresses in the table
        const existingRows = await driver.findElements(By.css('.popTable_wmac tbody tr'));
        for (const row of existingRows) {
            const deleteButton = await row.findElement(By.css('button[name="removeMacButton"]'));
            await deleteButton.click();
            console.log('Removed existing MAC address from the table.');
            await driver.sleep(1000); // Optional: sleep to allow for UI updates
        }

        // Retrieve blacklisted MAC addresses from the database
        const blacklistEntries = await blacklistCollection.find({}).toArray();
        console.log(`Retrieved ${blacklistEntries.length} blacklisted MAC addresses from the database.`);

        // Fill in the MAC addresses to the table
        const macAddresses = blacklistEntries.map(entry => entry.macAddress);
        const totalMacsToFill = 5; // Assuming you need to fill 5 MAC address fields

        for (let i = 0; i < totalMacsToFill; i++) {
            let macAddress = macAddresses[i] || '00:00:00:00:00:00'; // Fill remaining spaces with '00:00:00:00:00:00'

            // Wait for the input field for MAC addresses to be present
            const macInputField = await driver.wait(until.elementLocated(By.css('input[type="text"][name="macAddressField"]')), 15000);
            await macInputField.clear();
            await macInputField.sendKeys(macAddress);
            console.log(`Filled MAC address: ${macAddress}`);

            // Click the "Add" button to add the MAC address
            await driver.executeScript('document.querySelector("button[name=\'addMacButton\']").click();');
            await driver.sleep(1000); // Optional: sleep to allow for UI updates
        }

        // Finally, submit the form to save the settings
        await driver.executeScript('document.querySelector("input[type=\'submit\'][name=\'save\']").click();');
        console.log('Settings saved successfully.');

    } catch (error) {
        console.error('Error during applying the blacklist:', error);
    } finally {
        // Close MongoDB connection safely
        try {
            await client.close();
            console.log('MongoDB connection closed.');
        } catch (closeError) {
            console.error('Error closing MongoDB connection:', closeError);
        }
    }
}

module.exports = applyBlacklist;
