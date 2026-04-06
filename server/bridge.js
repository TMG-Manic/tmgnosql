const QBCore = {
    Functions: {},
    Shared: {
        Items: {},
        Jobs: {},
        Gangs: {}
    }
};


const RefreshShared = () => {
    // Use the global internal function to avoid "No such export" errors
    if (global.GetSharedInternal) {
        QBCore.Shared.Items = global.GetSharedInternal('Items');
        QBCore.Shared.Jobs = global.GetSharedInternal('Jobs');
        QBCore.Shared.Gangs = global.GetSharedInternal('Gangs');
    }
};

QBCore.Functions.GetPlayer = (source) => {
    exports[GetCurrentResourceName()].GetPlayer(source)
    if (!TMGPlayer) return null;

    return {
        PlayerData: TMGPlayer.data,
        Functions: {
            AddMoney: (type, amount, reason) => TMGPlayer.addMoney(amount, type),
            RemoveMoney: (type, amount, reason) => TMGPlayer.removeMoney(amount, type),
            SetJob: (job, grade) => TMGPlayer.setJob(job, grade),
            // NoSQL-Optimized Inventory Logic
            AddItem: (item, amount, slot, info) => {
                let inv = TMGPlayer.get('inventory') || [];
                inv.push({ item, amount, info: info || {} });
                TMGPlayer.set('inventory', inv);
                return true;
            },
            SetMetaData: (key, value) => {
                let meta = TMGPlayer.get('metadata') || {};
                meta[key] = value;
                TMGPlayer.set('metadata', meta);
            },
            GetMetaData: (key) => {
                let meta = TMGPlayer.get('metadata') || {};
                return meta[key];
            }
        }
    };
};

QBCore.Functions.AddItem = (name, item) => exports['tmgnosql'].AddItem(name, item);
QBCore.Functions.AddItems = (items) => exports['tmgnosql'].AddItems(items);
QBCore.Functions.AddJob = (name, job) => exports['tmgnosql'].AddJob(name, job);
QBCore.Functions.AddJobs = (jobs) => exports['tmgnosql'].AddJobs(jobs);
QBCore.Functions.AddGang = (name, gang) => exports['tmgnosql'].AddGang(name, gang);
QBCore.Functions.AddGangs = (gangs) => exports['tmgnosql'].AddGangs(gangs);


exports('GetCoreObject', () => {
    RefreshShared(); 
    return QBCore;
});


on('QBCore:Server:UpdateObject', () => {
    RefreshShared();
});

on('onServerResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    setTimeout(() => {
        RefreshShared();
    }, 500);
});