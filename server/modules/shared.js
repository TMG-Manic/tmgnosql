global.SharedData = { Items: {}, Jobs: {}, Gangs: {} };

global.GetSharedInternal = function(type) {
    return global.SharedData[type] || {};
};

exports('GetShared', global.GetSharedInternal);

async function loadSharedData() {
    const db = global.GetMainframeDB();
    if (!db) return; // Silent return, let the event trigger it
    
    const collections = ['Items', 'Jobs', 'Gangs'];
    for (const col of collections) {
        try {
            const data = await db.collection(`shared_${col.toLowerCase()}`).find().toArray();
            data.forEach(item => {
                global.SharedData[col][item.name] = item.data;
            });
        } catch (e) {
            console.log(`^1[TMGNoSQL]^7 Error syncing collection: ${col}`);
        }
    }
    console.log('^5[TMG Mainframe]^7 Shared Data Cache Synced.');
}

// LISTEN FOR CORE SIGNAL
on('TMGNoSQL:DatabaseReady', function() {
    loadSharedData();
});