fx_version 'cerulean'
game 'gta5'
lua54 'yes'

-- Points the server to your mongodb driver
server_module_export 'server/node_modules'

server_scripts {
    'server/core.js'
}

server_exports {
    'GetDatabase',
    'FetchOne',
    'FetchAll',
    'UpdateOne',
    'UpdateMany',
    'UpdateAll',
    'DeleteMany',
    'Find',
    'SaveToCollection'
}