const Players = new Map();

class TMGPlayer {
    constructor(source, citizenid, data) {
        this.source = source;
        this.citizenid = citizenid;
        this.data = data;
        this.isDirty = false;
    }

    async save() {
        if (!this.isDirty) return;
        const db = exports[GetCurrentResourceName()].GetDatabase();
        if (!db) return;
        // Search by citizenid for QBCore alignment
        await db.collection('players').updateOne(
            { citizenid: this.citizenid }, 
            { $set: this.data }
        );
        this.isDirty = false;
    }
}

exports('GetPlayer', (source) => Players.get(parseInt(source)));

onNet('TMGNoSQL:server:PlayerLoaded', async (source, citizenid) => {
    const db = exports[GetCurrentResourceName()].GetDatabase();
    let playerData = await db.collection('players').findOne({ citizenid: citizenid });

    if (!playerData) {
        playerData = {
            citizenid: citizenid,
            name: GetPlayerName(source),
            money: { cash: 500, bank: 0 },
            charinfo: {},
            inventory: {},
            metadata: {}
        };
        await db.collection('players').insertOne(playerData);
    }

    const playerObject = new TMGPlayer(source, citizenid, playerData);
    Players.set(parseInt(source), playerObject);
});

setInterval(() => { Players.forEach(p => p.save()); }, 300000);

on('playerDropped', () => {
    const src = source;
    if (Players.has(src)) {
        Players.get(src).save();
        Players.delete(src);
    }
});