local isLoggedIn = false
PlayerData = {}

RegisterNetEvent('TMGNoSQL:client:UpdatePlayer', function(data)
    PlayerData = data
    isLoggedIn = true
    TriggerEvent('QBCore:Client:OnPlayerLoaded', PlayerData)
end)

AddEventHandler('playerSpawned', function()
    if not isLoggedIn then
        TriggerServerEvent('TMGNoSQL:server:Initialize')
    end
end)

local Callbacks = {}
exports('TriggerCallback', function(name, cb, ...)
    Callbacks[name] = cb
    TriggerServerEvent('TMGNoSQL:server:TriggerCallback', name, ...)
end)

RegisterNetEvent('TMGNoSQL:client:CallbackResponse', function(name, ...)
    if Callbacks[name] then
        Callbacks[name](...)
        Callbacks[name] = nil
    end
end)

exports('GetPlayerData', function() return PlayerData end)
exports('IsLoggedIn', function() return isLoggedIn end)