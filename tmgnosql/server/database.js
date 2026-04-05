if (!global.performance) {
    global.performance = { now: () => Date.now() };
}

const { MongoClient } = require(`${GetResourcePath(GetCurrentResourceName())}/server/node_modules/mongodb`);
const mongoUri = GetConvar('mongodb_uri', 'mongodb://localhost:27017');
const dbName = GetConvar('mongodb_db', 'TMG_Mainframe');

let db = null;
let client = null;

global.GetMainframeDB = () => db;
global.GetDB = () => db; 
exports('GetDatabase', () => db);

async function connectToDatabase() {
    try {
        console.log('^3[TMG]^7 Attempting to connect to MongoDB...');
        client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db(dbName);
        
        console.log('^5[TMG]^7 Successfully connected to MongoDB Cluster.');

        // ✅ FIX: Indexing now happens AFTER the connection is established
        await db.collection('player_warns').createIndex({ targetIdentifier: 1 });
        await db.collection('players').createIndex({ citizenid: 1 }); // Added for core performance
        console.log('^2[TMG]^7 Collection Indexes Verified.');

    } catch (e) {
        console.error('^1[TMG] Connection Failed:^7', e);
    }
}

connectToDatabase();

exports('BulkUpdate', async (collection, operations) => {
    const database = global.GetMainframeDB();
    if (!database) return false;

    try {
        const result = await database.collection(collection).bulkWrite(operations);
        return result.modifiedCount;
    } catch (e) {
        console.error('^1[TMG] Bulk Update Failed:^7', e);
        return false;
    }
});

exports('UpdateOne', async (collection, filter, update, options = {}) => {
    if (!db) return false;
    try {
        const result = await db.collection(collection).updateOne(filter, update, options);
        return result.acknowledged;
    } catch (e) { return false; }
});

// Needed for the Bans table count check
exports('CountDocuments', async (collection, query = {}) => {
    if (!db) return 0;
    return await db.collection(collection).countDocuments(query);
});

// Needed for precise item fetching
exports('FetchOne', async (collection, query, projection = {}) => {
    if (!db) return null;
    return await db.collection(collection).findOne(query, { projection });
});

on('onResourceStop', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    if (client) {
        client.close();
        console.log('^3[TMG]^7 Database connection closed.');
    }
});