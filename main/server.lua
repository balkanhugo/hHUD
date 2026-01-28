Framework = nil
Framework = GetFramework()

if not Config then
    Config = {
        Framework = "QBCore",
        HUD = {}
    }
end

Citizen.CreateThread(function()
    while Framework == nil do 
        Framework = GetFramework()
        Citizen.Wait(1000) 
    end
    Citizen.Wait(2000)
end)

local function GetPlayer(source)
    if Config.Framework == "ESX" or Config.Framework == "NewESX" then
        return Framework.GetPlayerFromId(source)
    else
        return Framework.Functions.GetPlayer(source)
    end
end

local function TriggerCallback(name, source, cb, ...)
    if Config.Framework == "ESX" or Config.Framework == "NewESX" then
        Framework.TriggerServerCallback(name, source, cb, ...)
    else
        Framework.Functions.TriggerCallback(name, source, cb, ...)
    end
end

local function CreateCallback(name, cb)
    if Config.Framework == "ESX" or Config.Framework == "NewESX" then
        Framework.RegisterServerCallback(name, cb)
    else
        Framework.Functions.CreateCallback(name, cb)
    end
end

RegisterServerEvent('hud:server:UpdateMoney')
AddEventHandler('hud:server:UpdateMoney', function(source, type, amount)
    local Player = GetPlayer(source)
    if Player then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            if type == 'cash' then
                Player.setMoney(amount)
            elseif type == 'bank' then
                Player.setAccountMoney('bank', amount)
            elseif type == 'crypto' then
                Player.setAccountMoney('black_money', amount)
            end
        else
            if type == 'cash' then
                Player.Functions.SetMoney('cash', amount)
            elseif type == 'bank' then
                Player.Functions.SetMoney('bank', amount)
            elseif type == 'crypto' then
                Player.Functions.SetMoney('crypto', amount)
            end
        end
        TriggerClientEvent('hud:client:UpdateMoney', source, type, amount)
    end
end)

RegisterServerEvent('hud:server:UpdateNeeds')
AddEventHandler('hud:server:UpdateNeeds', function(source, hunger, thirst)
    local Player = GetPlayer(source)
    if Player then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            TriggerEvent('esx_status:set', source, 'hunger', hunger)
            TriggerEvent('esx_status:set', source, 'thirst', thirst)
        else
            Player.Functions.SetMetaData('hunger', hunger)
            Player.Functions.SetMetaData('thirst', thirst)
        end
        TriggerClientEvent('hud:client:UpdateNeeds', source, hunger, thirst)
    end
end)

CreateCallback('hud:server:GetPlayerData', function(source, cb)
    local Player = GetPlayer(source)
    if Player then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            cb({
                money = {
                    cash = Player.getMoney(),
                    bank = Player.getAccount('bank').money,
                    crypto = Player.getAccount('black_money').money
                },
                job = Player.job,
                metadata = Player.getMeta()
            })
        else
            cb({
                money = Player.PlayerData.money,
                job = Player.PlayerData.job,
                metadata = Player.PlayerData.metadata
            })
        end
    else
        cb(nil)
    end
end)

RegisterServerEvent('hud:server:SaveSettings')
AddEventHandler('hud:server:SaveSettings', function(settings, colors)
    local src = source
    local Player = GetPlayer(src)
    if Player then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            Player.setMeta('hudSettings', settings)
            Player.setMeta('hudColors', colors)
        else
            Player.Functions.SetMetaData('hudSettings', settings)
            Player.Functions.SetMetaData('hudColors', colors)
        end
    end
end)

CreateCallback('hud:server:LoadSettings', function(source, cb)
    local Player = GetPlayer(source)
    if Player then
        local hudSettings, hudColors
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            hudSettings = Player.getMeta('hudSettings') or Config.HUD.DefaultSettings
            hudColors = Player.getMeta('hudColors') or Config.HUD.DefaultColors
        else
            hudSettings = Player.PlayerData.metadata['hudSettings'] or Config.HUD.DefaultSettings
            hudColors = Player.PlayerData.metadata['hudColors'] or Config.HUD.DefaultColors
        end
        cb({ settings = hudSettings, colors = hudColors })
    else
        cb({ settings = Config.HUD.DefaultSettings, colors = Config.HUD.DefaultColors })
    end
end)

CreateThread(function()
    while true do
        local playerCount = #GetPlayers()
        local maxPlayers = GetConvarInt('sv_maxclients', 48)
        TriggerClientEvent('hud:client:UpdatePlayerCount', -1, playerCount, maxPlayers)
        Wait(Config.HUD.PlayerCountUpdateInterval or 10000)
    end
end)

if Config.Framework == "ESX" or Config.Framework == "NewESX" then
    Framework.RegisterCommand('hudreload', 'admin', function(xPlayer, args, showError)
        TriggerClientEvent('hud:client:ReloadHUD', xPlayer.source)
        TriggerClientEvent('esx:showNotification', xPlayer.source, 'HUD başarıyla yeniden yüklendi!')
    end, false, {help = 'HUD\'ı yeniden yükle'})
else
    Framework.Commands.Add('hudreload', 'HUD\'ı yeniden yükle', {}, false, function(source)
        local Player = GetPlayer(source)
        if Player.PlayerData.job.name == 'admin' or Framework.Functions.HasPermission(source, 'admin') then
            TriggerClientEvent('hud:client:ReloadHUD', source)
            TriggerClientEvent('QBCore:Notify', source, 'HUD başarıyla yeniden yüklendi!', 'success')
        else
            TriggerClientEvent('QBCore:Notify', source, 'Bu komutu kullanma yetkiniz yok!', 'error')
        end
    end)
end

RegisterNetEvent('hud:server:UpdateHealth', function(health)
    local src = source
    TriggerClientEvent('hud:client:UpdateHealth', src, health)
end)

RegisterNetEvent('hud:server:UpdateArmor', function(armor)
    local src = source
    TriggerClientEvent('hud:client:UpdateArmor', src, armor)
end)