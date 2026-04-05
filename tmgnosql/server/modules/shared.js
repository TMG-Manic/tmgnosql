global.SharedData = { Items: {}, Jobs: {}, Gangs: {} };

global.GetSharedInternal = (type) => {
    return global.SharedData[type] || {};
};

exports('GetShared', global.GetSharedInternal);
async function loadSharedData() {
    const db = global.GetMainframeDB ? global.GetMainframeDB() : null;
    
    if (!db) {
        console.log('^3[TMGNoSQL]^7 Shared Module: Waiting for database handshake...');
        return setTimeout(loadSharedData, 1500);
    }
    
    const collections = ['Items', 'Jobs', 'Gangs'];
    for (const col of collections) {
        try {
            const data = await db.collection(`shared_${col.toLowerCase()}`).find().toArray();
            data.forEach(item => {
                SharedData[col][item.name] = item.data;
            });
        } catch (e) {
            console.log(`^1[TMGNoSQL]^7 Error syncing collection: ${col}`);
        }
    }
    console.log('^5[TMG Mainframe]^7 Shared Data Cache Synced.');
}

async function updateShared(type, name, data) {
    const db = exports['TMGNoSQL'].GetDatabase();
    if (!db) return false;
    SharedData[type][name] = data;
    await db.collection(`shared_${type.toLowerCase()}`).updateOne(
        { name: name }, { $set: { name: name, data: data } }, { upsert: true }
    );
    TriggerEvent('QBCore:Server:UpdateObject');
    TriggerClientEvent('QBCore:Client:UpdateObject', -1);
    return true;
}

exports('AddItem', async (n, i) => {
    const res = await updateShared('Items', n, i);
    return [res, res ? "success" : "error"];
});

exports('AddJob', async (n, j) => {
    const res = await updateShared('Jobs', n, j);
    return [res, res ? "success" : "error"];
});

exports('AddItems', async (items) => {
    for (const [n, d] of Object.entries(items)) { await updateShared('Items', n, d); }
    return [true, "success"];
});

exports('GetShared', (type) => SharedData[type]);

let isReady = false;
exports('isMainframeReady', () => isReady);

// At the bottom of shared.js
on('onServerResourceStart', (res) => {
    if (res === GetCurrentResourceName()) {
        // Wait 2 seconds for database.js to connect to MongoDB
        setTimeout(() => {
            loadSharedData();
        }, 2000);
    }
});