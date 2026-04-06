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
    'server/core.js',       -- The ONLY file with MongoClient
    'server/player.js',
    'server/modules/shared.js',
    'server/bridge.js'
}

client_scripts {
    'client/main.lua'
}

server_exports {
    'GetDatabase',
    'FetchOne',
    'FetchAll',
    'UpdateOne',
    'UpdateMany',
    'UpdateAll',
    'CheckIfExists',
    'SaveToCollection'
}