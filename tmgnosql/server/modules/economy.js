// server/modules/economy.js
const Economy = {
    async addMoney(player, amount, type, reason) {
        let current = player.get('money');
        current[type] = (current[type] || 0) + amount;
        player.set('money', current);
        
        // Log to TMG Mainframe Audit
        console.log(`^5[ECONOMY]^7 ${player.data.name} received ${amount} (${type}) for ${reason}`);
    },

    async removeMoney(player, amount, type, reason) {
        let current = player.get('money');
        if (current[type] >= amount) {
            current[type] -= amount;
            player.set('money', current);
            return true;
        }
        return false;
    }
};

exports('GetEconomy', () => Economy);