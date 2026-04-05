fx_version 'cerulean'
game 'gta5'

author 'TMG'
description 'TMG NoSQL Core - MongoDB Framework for all'
version '1.0.0'

lua54 'yes'

-- This is CRITICAL: It tells FiveM where to find the MongoDB driver
server_module_export 'server/node_modules'

-- Server side using Node.js environment
server_scripts {
    'server/database.js',
    'server/player.js',
    'server/modules/*.js', -- Load all modular logic (Inventory, Stashes, etc)
    'server/bridge.js',    -- Load the QBCore compatibility bridge
    'server/main.js',
    'server/setup_db.js'   -- Your Saturation & Ghost Profile logic
}

client_scripts {
    'client/main.lua'
}

-- [[ MAINFRAME EXPORTS ]]
-- We added the ones below to support the Inventory & Bans logic
exports {
    -- Player & Identity
    'GetPlayerByCitizenId',
    'GetPlayerByLicense',
    'SavePlayerNoSQL',
    'BulkDeleteCharacter',
    
    -- Generic Data Engines (The "Workhorses")
    'FetchAll',
    'FetchOne',
    'UpdateAll',
    'UpdateOne',      -- REQUIRED for AddItem/RemoveItem
    'InsertDocument', -- REQUIRED for Ghost Saturation
    'CountDocuments', -- REQUIRED for the Bans Table check
    'CheckIfExists',
    
    -- Network Utilities
    'CreateCallback'
}