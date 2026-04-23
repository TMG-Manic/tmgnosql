// [[ TMG MAIN FRAME - STABILIZED CORE ]]
const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

const mongoUri = GetConvar('mongodb_uri', 'mongodb://localhost:27017');
const dbName = GetConvar('mongodb_db', 'TMG_Mainframe');

let db = null;

const sanitizeUpdate = (u) => {
    if (!u || typeof u !== 'object' || Array.isArray(u)) return {};
    return Object.keys(u).some(k => k.startsWith('$')) ? u : { "$set": u };
};

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

exports('GetDatabase', () => db);
exports('FetchAll', async (col, q) => {
    if (!db) return [];
    try { return await db.collection(col).find(q || {}).toArray(); } catch (e) { return []; }
});

exports('FetchOne', async (col, q) => {
    if (!db) return null;
    try { return await db.collection(col).findOne(q || {}); } catch (e) { return null; }
});

exports('DeleteMany', async (col, q) => {
    if (!db) return false;
    try { const res = await db.collection(col).deleteMany(q || {}); return res.acknowledged; } catch (e) { return false; }
});

exports('Find', async (col, q) => {
    if (!db) return [];
    try { return await db.collection(col).find(q || {}).toArray(); } catch (e) { return []; }
});

exports('UpdateOne', async (col, f, u, o) => {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateOne(f, sanitizeUpdate(u), o || { upsert: true });
        return result.acknowledged;
    } catch (e) { 
        console.error('^1[TMG] UpdateOne Error:^7', e.message);
        return false; 
    }
});

exports('UpdateMany', performUpdateMany);
exports('UpdateAll', performUpdateMany);

exports('SaveToCollection', async (col, f, d) => {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateOne(f, { "$set": d }, { upsert: true });
        return result.acknowledged;
    } catch (e) { return false; }
});