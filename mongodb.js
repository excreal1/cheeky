const { MongoClient } = require('mongodb');

async function setupDatabase() {
    const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI if different
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db("cheeky");

        // Create whitelist collection and insert hardcoded data
        const whitelist = db.collection("whitelist");
        await whitelist.insertMany([
            { clientName: "III", macAddress: "A0:A8:CD:52:F6:A2" },
            { clientName: "Merlin", macAddress: "64:80:99:E3:19:8A" },
            { clientName: "Handy", macAddress: "52:46:B4:99:CD:FD" }
        ]);
        console.log("Whitelist collection created and populated.");

        // Create blacklist collection if it doesn't exist (for dynamic entries)
        const blacklist = db.collection("blacklist");
        console.log("Blacklist collection ready for dynamic entries.");

    } catch (error) {
        console.error("Error setting up database:", error);
    } finally {
        await client.close();
    }
}

setupDatabase().catch(console.error);
