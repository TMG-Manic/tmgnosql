// [[ TMG MAIN FRAME - STABILIZED LEGACY CORE ]]

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

const mongoUri = GetConvar('mongodb_uri', 'mongodb://localhost:27017');
const dbName = GetConvar('mongodb_db', 'TMG_Mainframe');

let db = null;

// ATOMIC PROTECTION GATE
const sanitizeUpdate = function(update) {
    if (!update) return {};
    const keys = Object.keys(update);
    let hasOperator = false;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith('$')) {
            hasOperator = true;
            break;
        }
    }
    return hasOperator ? update : { "$set": update };
};

// 1. INTERNAL UPDATE HANDLER (Fixes the TypeError)
const performUpdateMany = async function(col, f, u, o) {
    if (!db) return false;
    try {
        const options = o || {};
        const result = await db.collection(col).updateMany(f, sanitizeUpdate(u), options);
        return result.acknowledged;
    } catch (e) {
        console.error(`^1[TMG] UpdateMany Failed:^7`, e);
        return false;
    }
};

MongoClient.connect(mongoUri, { useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.error('^1[TMG] Mainframe: Connection Failed:^7', err);
        return;
    }
    
    const connectedDb = client.db(dbName);
    db = connectedDb;
    
    global.GetMainframeDB = function() { return db; };

    console.log('^5[TMG]^7 Mainframe: Connection Secured via Legacy Driver.');

    db.collection('players').createIndex({ citizenid: 1 });
    db.collection('player_vehicles').createIndex({ plate: 1 });
    
    TriggerEvent('TMGNoSQL:DatabaseReady');
});

exports('GetDatabase', function() { return db; });

exports('FetchOne', async function(col, q) {
    if (!db) return null;
    return await db.collection(col).findOne(q || {});
});

exports('FetchAll', async function(col, q) {
    if (!db) return [];
    try {
        const filter = (q && typeof q === 'object' && !Array.isArray(q)) ? q : {};
        return await db.collection(col).find(filter).toArray();
    } catch (e) { return []; }
});

exports('UpdateOne', async function(col, f, u, o) {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateOne(f, sanitizeUpdate(u), o || {});
        return result.acknowledged;
    } catch (e) { return false; }
});

exports('UpdateMany', performUpdateMany);
exports('UpdateAll', performUpdateMany);

exports('CheckIfExists', async function(col, q) {
    if (!db) return false;
    try {
        const filter = (q && typeof q === 'object' && !Array.isArray(q)) ? q : {};
        const count = await db.collection(col).countDocuments(filter, { limit: 1 });
        return count > 0;
    } catch (e) { return false; }
});

exports('SaveToCollection', async function(col, f, d) {
    if (!db) return false;
    try {
        const result = await db.collection(col).updateOne(f, { "$set": d }, { upsert: true });
        return result.acknowledged;
    } catch (e) { return false; }
});

exports('Find', async function(col, q) {
    if (!db) return [];
    try {
        const filter = (q && typeof q === 'object') ? q : {};
        return await db.collection(col).find(filter).toArray();
    } catch (e) { return []; }
});

exports('DeleteMany', async function(col, q) {
    if (!db) return false;
    try {
        const result = await db.collection(col).deleteMany(q || {});
        return result.acknowledged;
    } catch (e) { return false; }
});