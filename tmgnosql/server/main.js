const ServerCallbacks = {};

const getDB = () => {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    if (!db) console.log('^1[TMG NoSQL]^7 ERROR: Attempted DB call before connection!');
    return db;
};

exports('GetPlayerByCitizenId', async (citizenid) => {
    const db = getDB();
    return db ? await db.collection('players').findOne({ citizenid: citizenid }) : null;
});

exports('GetPlayerByLicense', async (license) => {
    const db = getDB();
    return db ? await db.collection('players').findOne({ license: license }) : null;
});

exports('SavePlayerNoSQL', async (citizenid, data) => {
    const db = getDB();
    if (!db) return false;
    try {
        await db.collection('players').updateOne({ citizenid: citizenid }, { $set: data }, { upsert: true });
        return true;
    } catch (e) { return false; }
});

exports('CheckIfExists', async (collection, query) => {
    const db = getDB();
    if (!db) return true;

    try {
        // LUA FIX: If 'query' is empty or an array, force it to an object {}
        const filter = (query && typeof query === 'object' && !Array.isArray(query)) 
            ? query 
            : {};

        const count = await db.collection(collection).countDocuments(filter, { limit: 1 });
        return count > 0;
    } catch (e) {
        console.error(`^1[TMG NoSQL]^7 Exists Check Failed: ${e.message}`);
        return true; 
    }
});

exports('BulkDeleteCharacter', async (citizenid) => {
    const db = getDB();
    if (!db) return false;
    const collections = ['players', 'apartments', 'bank_accounts', 'crypto_transactions', 'phone_messages', 'playerskins', 'player_contacts', 'player_houses', 'player_mails', 'player_outfits', 'player_vehicles'];
    try {
        const deletePromises = collections.map(col => db.collection(col).deleteMany({ citizenid: citizenid }));
        await Promise.all(deletePromises);
        return true;
    } catch (e) { return false; }
});

exports('GetBanByLicense', async (license) => {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    if (!db) return null;
    return await db.collection('bans').findOne({ license: license });
});

exports('DeleteBan', async (license) => {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    if (!db) return false;
    try {
        await db.collection('bans').deleteOne({ license: license });
        console.log(`^2[TMG Mainframe]^7 Ban lifted for license: ${license}`);
        return true;
    } catch (e) {
        return false;
    }
});

exports('SaveBanNoSQL', async (license, data) => {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    if (!db) return false;

    try {
       
        await db.collection('bans').updateOne(
            { license: license },
            { $set: data },
            { upsert: true }
        );
        console.log(`^1[TMG Mainframe]^7 Ban recorded for: ${data.name} (${license})`);
        return true;
    } catch (e) {
        console.error(`^1[TMG NoSQL]^7 Failed to record ban: ${e.message}`);
        return false;
    }
});

exports('InsertDocument', async (collection, data) => {
    const db = global.GetMainframeDB();
    if (!db) return false;
    await db.collection(collection).insertOne(data);
    return true;
});

// Upsert (Update if exists, else Insert)
exports('SaveToCollection', async (collection, filter, data) => {
    const db = global.GetMainframeDB();
    if (!db) return false;
    await db.collection(collection).updateOne(filter, { $set: data }, { upsert: true });
    return true;
});

// Delete One
exports('DeleteOne', async (collection, query) => {
    const db = global.GetMainframeDB();
    if (!db) return false;
    await db.collection(collection).deleteOne(query);
    return true;
});

/**
 * Fetch all documents matching a query (e.g., all houses for one citizenid)
 */
exports('FetchAll', async (collection, query) => {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    if (!db) return [];

    try {
        // Lua Fix: Ensure the query is an object
        const filter = (query && typeof query === 'object' && !Array.isArray(query)) ? query : {};
        
        // Convert the MongoDB cursor to a standard array for Lua
        return await db.collection(collection).find(filter).toArray();
    } catch (e) {
        console.error(`^1[TMG NoSQL]^7 FetchAll Failed in ${collection}: ${e.message}`);
        return [];
    }
});


onNet('TMGNoSQL:server:TriggerCallback', (name, ...args) => {
    const src = source;
    if (ServerCallbacks[name]) {
        ServerCallbacks[name](src, (...res) => {
            TriggerClientEvent('TMGNoSQL:client:CallbackResponse', src, name, ...res);
        }, ...args);
    }
});

exports('CreateCallback', (name, cb) => {
    ServerCallbacks[name] = cb;
});