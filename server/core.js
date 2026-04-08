// [[ TMG MAIN FRAME - STABILIZED CORE ]]
const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

const mongoUri = GetConvar('mongodb_uri', 'mongodb://localhost:27017');
const dbName = GetConvar('mongodb_db', 'TMG_Mainframe');

let db = null;

// Fixes the BSON mismatch error for all update operations
const sanitizeUpdate = (u) => {
    if (!u || typeof u !== 'object' || Array.isArray(u)) return {};
    return Object.keys(u).some(k => k.startsWith('$')) ? u : { "$set": u };
};

// Internal function to handle updates
const performUpdateMany = async (col, f, u, o) => {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateMany(f, sanitizeUpdate(u), o || {});
        return result.acknowledged;
    } catch (e) { return false; }
};

MongoClient.connect(mongoUri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error('^1[TMG] Mainframe: Connection Failed:^7', err);
    db = client.db(dbName);
    console.log('^5[TMG]^7 Mainframe: Connection Secured via Legacy Driver.');
    TriggerEvent('TMGNoSQL:DatabaseReady');
});

// Primary Exports
exports('GetDatabase', () => db);
exports('FetchAll', async (col, q) => {
    if (!db) return [];
    try { return await db.collection(col).find(q || {}).toArray(); } catch (e) { return []; }
});

exports('FetchOne', async (col, q) => {
    if (!db) return null;
    try { return await db.collection(col).findOne(q || {}); } catch (e) { return null; }
});

// Missing Exports requested by qb-policejob and qb-taxijob
exports('DeleteMany', async (col, q) => {
    if (!db) return false;
    try { const res = await db.collection(col).deleteMany(q || {}); return res.acknowledged; } catch (e) { return false; }
});

exports('Find', async (col, q) => {
    if (!db) return [];
    try { return await db.collection(col).find(q || {}).toArray(); } catch (e) { return []; }
});

// Logic Fix: Mapping both UpdateMany and UpdateAll to the internal handler
exports('UpdateMany', performUpdateMany);
exports('UpdateAll', performUpdateMany);

exports('SaveToCollection', async (col, f, d) => {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateOne(f, { "$set": d }, { upsert: true });
        return result.acknowledged;
    } catch (e) { return false; }
});