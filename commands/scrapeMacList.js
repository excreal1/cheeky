const { MongoClient } = require('mongodb');
const { By, until } = require('selenium-webdriver');

async function scrapeMacList(driver) {
    const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI if different
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db("cheeky");
        const whitelistCollection = db.collection("whitelist");
        const blacklistCollection = db.collection("blacklist");

        // Navigate to the Wireless Client MAC List page
        await driver.get('http://192.168.0.1/WClientMACList.asp');
        console.log('Navigated to Wireless Client MAC List page.');

        // Wait for the table and rows to be present
        await driver.wait(until.elementLocated(By.css('.popTable_wmac')), 10000);
        console.log('Wireless Client MAC List table located.');
        await driver.wait(until.elementsLocated(By.css('.popTable_wmac tbody tr')), 10000);

        // Find all rows in the table excluding the header
        const rows = await driver.findElements(By.css('.popTable_wmac tbody tr'));
        const uniqueEntries = [];

        for (const row of rows) {
            let clientName = '';
            let macAddress = '';

            try {
                // Wait for each row to be visible
                await driver.wait(until.elementIsVisible(row), 10000);

                // Extract client name
                const nameElement = await row.findElement(By.css('td[headers="vw_client_name"]'));
                clientName = await nameElement.getText();
            } catch (error) {
                console.error('Error extracting client name:', error);
            }

            try {
                // Extract MAC address
                const macElement = await row.findElement(By.css('td[headers="vw_mac"]'));
                macAddress = await macElement.getText();
            } catch (error) {
                console.error('Error extracting MAC address:', error);
            }

            // Check if the MAC address is in the whitelist
            try {
                const isWhitelisted = await whitelistCollection.findOne({ macAddress });
                if (!isWhitelisted) {
                    // If not whitelisted, add to unique entries for blacklist insertion
                    uniqueEntries.push({ clientName, macAddress });
                }
            } catch (error) {
                console.error('Error checking whitelist:', error);
            }
        }

        // Insert blacklist entries into MongoDB, avoiding duplicates
        if (uniqueEntries.length > 0) {
            // Use bulkWrite to insert unique entries while handling duplicates
            const bulkOps = uniqueEntries.map(entry => ({
                updateOne: {
                    filter: { macAddress: entry.macAddress },
                    update: { $setOnInsert: entry },
                    upsert: true
                }
            }));

            const result = await blacklistCollection.bulkWrite(bulkOps, { ordered: false });
            console.log(`Blacklist updated in MongoDB with ${result.upsertedCount} new entries.`);
        } else {
            console.log('No new entries to add to the blacklist.');
        }

    } catch (error) {
        console.error('Error during MAC address scraping:', error);
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

module.exports = scrapeMacList;
