(async () => {
    try {
        // We use a private scope here so 'MongoClient' doesn't clash with other scripts
        const { MongoClient } = require('mongodb');
        const uri = "mongodb://localhost:27017";
        const client = new MongoClient(uri);

        console.log("^5[TMG Mainframe]^7 Ghost Profile Saturation Starting...");

        await client.connect();
        const db = client.db("TMG_Mainframe");

        // 1. The Ghost Ban (The "System Initializer")
        const ghostBan = {
            id: "system_init",
            license: "license:0000000000000000000000000000000000000000",
            name: "Mainframe_System",
            reason: "Initial Saturation Pulse",
            expire: 0,
            bannedby: "TMG_Mainframe"
        };

        // 2. Collection & Index Management
        // We ensure the 'bans' collection exists to satisfy QBCore's check
        const collections = await db.listCollections({ name: 'bans' }).toArray();
        if (collections.length === 0) {
            await db.createCollection('bans');
            console.log("[✔] Created Collection: bans");
        }

        // 3. Perform the Pulse (Upsert ensures it exists without duplicates)
        await db.collection('bans').updateOne(
            { id: "system_init" },
            { $set: ghostBan },
            { upsert: true }
        );

        // 4. Mimic SQL Primary Key with a Unique Index
        await db.collection('bans').createIndex({ id: 1 }, { unique: true });
        await db.collection('players').createIndex({ citizenid: 1 }, { unique: true });

        console.log("^2[TMG Mainframe]^7 Saturation Complete. QBCore connection check should pass.");
        
        await client.close();
    } catch (err) {
        // Log the error only if it isn't a simple re-declaration hitch
        if (!err.message.includes('already been declared')) {
            console.error("^1[Mainframe Setup Error]^7", err);
        }
    }
})();