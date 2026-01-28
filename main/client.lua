-- https://discord.gg/EkwWvFS

local Framework = nil
local PlayerData = {}
local isLoggedIn = false
local hudActive = true

CreateThread(function()
    Framework = GetFramework()
    while Framework == nil do
        Framework = GetFramework()
        Wait(1000)
    end
end)

CreateThread(function()
    while true do
        SetRadarBigmapEnabled(false, false)
        SetRadarZoom(1000)
        Wait(500)
    end
end)

Citizen.CreateThread(function()
    while true do
    Citizen.Wait(1)
    HideHudComponentThisFrame(6)
    HideHudComponentThisFrame(7)
    HideHudComponentThisFrame(8)
    HideHudComponentThisFrame(9)
    HideHudComponentThisFrame(3)
    HideHudComponentThisFrame(4)
    DisplayAmmoThisFrame(false)
    end
end)

local function updateMoneyVue(moneyType, amount)
    if not PlayerData then
        PlayerData = {}
    end
    
    if Config.Framework == "ESX" or Config.Framework == "NewESX" then
        if not PlayerData.accounts then
            PlayerData.accounts = {}
        end
        
        if moneyType == 'CASH' or moneyType == 'money' then
            PlayerData.money = amount or 0
        elseif moneyType == 'BANK' or moneyType == 'bank' then
            -- Find or create bank account
            local bankFound = false
            for i, account in ipairs(PlayerData.accounts) do
                if account.name == 'bank' then
                    account.money = amount or 0
                    bankFound = true
                    break
                end
            end
            if not bankFound then
                table.insert(PlayerData.accounts, {name = 'bank', money = amount or 0})
            end
        elseif moneyType == 'CRYPTO' or moneyType == 'crypto' or moneyType == 'black_money' then
            -- Find or create black_money account
            local blackMoneyFound = false
            for i, account in ipairs(PlayerData.accounts) do
                if account.name == 'black_money' then
                    account.money = amount or 0
                    blackMoneyFound = true
                    break
                end
            end
            if not blackMoneyFound then
                table.insert(PlayerData.accounts, {name = 'black_money', money = amount or 0})
            end
        end
    else
        -- QBCore
        if not PlayerData.money then
            PlayerData.money = {}
        end
        
        if moneyType == 'CASH' or moneyType == 'money' then
            PlayerData.money['cash'] = amount or 0
        elseif moneyType == 'BANK' or moneyType == 'bank' then
            PlayerData.money['bank'] = amount or 0
        elseif moneyType == 'CRYPTO' or moneyType == 'crypto' then
            PlayerData.money['crypto'] = amount or 0
        end
    end
end

local function updateJobVue(jobData)
    if not PlayerData.job then
        PlayerData.job = {}
    end

    if type(jobData) == 'string' then
        PlayerData.job.label = jobData
    elseif type(jobData) == 'table' then
        PlayerData.job.label = jobData.label or jobData.name or 'Unemployed'
        PlayerData.job.grade = jobData.grade or { level = 0 }
        if type(PlayerData.job.grade) == 'number' then
            PlayerData.job.grade = { level = PlayerData.job.grade }
        end
    end
end

local function TriggerFrameworkCallback(name, cb, ...)
    if Config.Framework == "ESX" or Config.Framework == "NewESX" then
        Framework.TriggerServerCallback(name, cb, ...)
    else
        Framework.Functions.TriggerCallback(name, cb, ...)
    end
end

RegisterNetEvent('esx:setAccountMoney', function(account)
    if account and account.name and account.money then
        local moneyType = account.name
        updateMoneyVue(moneyType, account.money)
    end
end)

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job) 
    updateJobVue(job)
end)

RegisterNetEvent("QBCore:Player:SetPlayerData")
AddEventHandler("QBCore:Player:SetPlayerData", function(data)
    if data and data.money then
        for moneyType, amount in pairs(data.money) do
            if moneyType == 'cash' then
                updateMoneyVue('CASH', amount)
            elseif moneyType == 'bank' then
                updateMoneyVue('BANK', amount)
            elseif moneyType == 'crypto' then
                updateMoneyVue('CRYPTO', amount)
            end
        end
    end
    
    if data and data.job then
        updateJobVue(data.job)
    end
    
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate")
AddEventHandler("QBCore:Client:OnJobUpdate", function(jobData)
    updateJobVue(jobData)
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = getPlayerData()
    isLoggedIn = true
end)

RegisterNetEvent('esx:playerLoaded', function(playerData)
    PlayerData = playerData
    isLoggedIn = true
end)

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then return end
    Wait(1000)
    PlayerData = getPlayerData()
    if PlayerData and next(PlayerData) then
        isLoggedIn = true
    end
end)

function getPlayerData()
    if not Framework then 
        return {} 
    end
    
    local success, data = pcall(function()
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            return Framework.GetPlayerData()
        else
            return Framework.Functions.GetPlayerData()
        end
    end)
    
    if success and data then
        return data
    else
        return {}
    end
end

local function updateStatusVue(statusName, value)
    if not statusName or not value then
        return
    end
    
    local normalizedValue = 0
    value = tonumber(value) or 0
    
    if value > 10000 then
        normalizedValue = math.ceil(value / 10000)
    elseif value > 100 then
        normalizedValue = 100
    else
        normalizedValue = math.ceil(value)
    end
    
    normalizedValue = math.max(0, math.min(100, normalizedValue))
    
    if not PlayerData then
        PlayerData = {}
    end
    if not PlayerData.metadata then
        PlayerData.metadata = {}
    end
    
    PlayerData.metadata[statusName] = normalizedValue
end

RegisterNetEvent("esx_status:onTick")
AddEventHandler("esx_status:onTick", function(data)
    if data and type(data) == 'table' then
        for _, v in pairs(data) do
            if v and v.name and v.val then
                if v.name == 'hunger' or v.name == 'thirst' then
                    updateStatusVue(v.name, v.val)
                end
            end
        end
    end
end)

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    if PlayerData.metadata then
        local hunger = math.max(0, math.min(100, math.ceil(newHunger or 0)))
        local thirst = math.max(0, math.min(100, math.ceil(newThirst or 0)))
        
        PlayerData.metadata['hunger'] = hunger
        PlayerData.metadata['thirst'] = thirst
    end
end)

local LastData = {
    health = -1,
    armor = -1,
    hunger = -1,
    thirst = -1,
    cash = -1,
    bank = -1,
    blackMoney = -1,
    jobName = '',
    jobGrade = -1,
    playerId = -1,
    inVehicle = nil,
    speed = -1,
    gear = '',
    fuel = -1,
    rpm = -1,
    nitrous = -1,
    engineHealth = -1,
    seatbelt = false,
    cruise = false,
    streetName = '',
    zoneName = '',
    heading = -1,
    x = -1,
    y = -1,
    z = -1,
    onlinePlayers = -1,
    maxPlayers = -1
}

local function hasDataChanged(newData)
    for key, value in pairs(newData) do
        if LastData[key] == nil or LastData[key] ~= value then
            return true
        end
    end
    return false
end

local function updateLastData(newData)
    for key, value in pairs(newData) do
        LastData[key] = value
    end
end

local function sendHUDUpdate(data)
    if hasDataChanged(data) then
        SendNUIMessage({
            type = 'updateAll',
            data = data
        })
        updateLastData(data)
    end
end

local forceTestVehicle = false

RegisterCommand('testhud', function()
    forceTestVehicle = not forceTestVehicle
end, false)

local function updateHUD()
    if not hudActive then 
        return 
    end
    
    local ped = PlayerPedId()
    local currentData = {}
    
    currentData.health = math.max(0, GetEntityHealth(ped) - 100)
    currentData.armor = GetPedArmour(ped)
    currentData.playerId = GetPlayerServerId(PlayerId())
    
    if isLoggedIn and PlayerData.metadata then
        currentData.hunger = PlayerData.metadata['hunger'] or 100
        currentData.thirst = PlayerData.metadata['thirst'] or 100
    else
        currentData.hunger = 100
        currentData.thirst = 100
    end
    
    if isLoggedIn and PlayerData then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            -- ESX money structure
            currentData.cash = PlayerData.money or 0
            
            -- Get bank account
            currentData.bank = 0
            if PlayerData.accounts then
                for _, account in ipairs(PlayerData.accounts) do
                    if account.name == 'bank' then
                        currentData.bank = account.money or 0
                        break
                    end
                end
            end
            
            -- Get black money
            currentData.blackMoney = 0
            if PlayerData.accounts then
                for _, account in ipairs(PlayerData.accounts) do
                    if account.name == 'black_money' then
                        currentData.blackMoney = account.money or 0
                        break
                    end
                end
            end
        else
            -- QBCore money structure
            currentData.cash = PlayerData.money and PlayerData.money.cash or 0
            currentData.bank = PlayerData.money and PlayerData.money.bank or 0
            currentData.blackMoney = PlayerData.money and PlayerData.money.black_money or 0
        end
    else
        currentData.cash = 0
        currentData.bank = 0
        currentData.blackMoney = 0
    end

    if isLoggedIn and PlayerData and PlayerData.job then
        if Config.Framework == "ESX" or Config.Framework == "NewESX" then
            currentData.jobName = PlayerData.job.label or PlayerData.job.name or 'Unemployed'
            currentData.jobGrade = PlayerData.job.grade or 0
        else
            -- QBCore
            currentData.jobName = PlayerData.job.label or 'Unemployed'
            currentData.jobGrade = PlayerData.job.grade and PlayerData.job.grade.level or 0
        end
    else
        currentData.jobName = 'Unemployed'
        currentData.jobGrade = 0
    end

    local realInVehicle = IsPedInAnyVehicle(ped, false)
    currentData.inVehicle = forceTestVehicle or realInVehicle
    
    if currentData.inVehicle then        
        if forceTestVehicle then
            currentData.speed = math.random(60, 180)
            currentData.fuel = math.random(50, 100)
            currentData.rpm = math.random(2000, 7000)
            currentData.gear = 'D'
            currentData.engineHealth = 1000
        else
            local vehicle = GetVehiclePedIsIn(ped, false)
            
            if vehicle and vehicle ~= 0 then
                local speedCalc = (Config.speedMultiplier == 'KM/H') and 3.6 or 2.23694
                currentData.speed = math.floor(GetEntitySpeed(vehicle) * speedCalc)
                
                currentData.fuel = math.floor(Config.GetVehFuel(vehicle))
                
                local rawRpm = GetVehicleCurrentRpm(vehicle)
                currentData.rpm = math.floor(rawRpm * Config.Vehicle.MaxRPM)
                
                local gearNum = GetVehicleCurrentGear(vehicle)
                local vehicleSpeed = GetEntitySpeed(vehicle)
                
                if gearNum == 0 then
                    currentData.gear = 'R'
                elseif not GetIsVehicleEngineRunning(vehicle) then
                    currentData.gear = 'P'
                elseif vehicleSpeed < 0.5 then
                    currentData.gear = 'N'
                else
                    currentData.gear = 'D'
                end
                
                currentData.engineHealth = GetVehicleEngineHealth(vehicle)
            else
                currentData.inVehicle = false
            end
        end
        
        currentData.seatbelt = seatbeltOn
        currentData.cruise = cruiseOn
        currentData.nitrous = Config.Vehicle.UseNitroSystem and 100 or 0
        
        if LastData.inVehicle ~= true then
            DisplayRadar(true)
        end
    else
        currentData.speed = 0
        currentData.gear = 'P'
        currentData.fuel = 0
        currentData.rpm = 0
        currentData.engineHealth = 1000
        currentData.seatbelt = false
        currentData.cruise = false
        currentData.nitrous = 0
        
        if LastData.inVehicle == true then
            DisplayRadar(false)
        end
    end
    
    local pos = GetEntityCoords(ped)
    local posChanged = (math.abs(pos.x - (LastData.x or 0)) > 5) or 
                      (math.abs(pos.y - (LastData.y or 0)) > 5) or 
                      (math.abs(pos.z - (LastData.z or 0)) > 2)
    
    if posChanged or LastData.streetName == '' then
        local streetHash, crossingHash = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
        currentData.streetName = GetStreetNameFromHashKey(streetHash)
        currentData.zoneName = GetLabelText(GetNameOfZone(pos.x, pos.y, pos.z))
        currentData.heading = math.floor(GetEntityHeading(ped))
        currentData.x = math.floor(pos.x)
        currentData.y = math.floor(pos.y)
        currentData.z = math.floor(pos.z)
    else
        currentData.streetName = LastData.streetName
        currentData.zoneName = LastData.zoneName
        currentData.heading = LastData.heading
        currentData.x = LastData.x
        currentData.y = LastData.y
        currentData.z = LastData.z
    end
    
    if GetGameTimer() % 5000 < 100 then
        currentData.onlinePlayers = #GetActivePlayers()
        currentData.maxPlayers = GetConvarInt('sv_maxclients', 48)
    else
        currentData.onlinePlayers = LastData.onlinePlayers
        currentData.maxPlayers = LastData.maxPlayers
    end
    
    sendHUDUpdate(currentData)
end

CreateThread(function()
    while true do
        updateHUD()
        Wait(Config.HUD.UpdateInterval or 100)
    end
end)

CreateThread(function()
    Wait(1000)
    
    SendNUIMessage({
        type = 'updateAll',
        data = {
            health = 100,
            armor = 0,
            hunger = 100,
            thirst = 100,
            stress = 0,
            cash = 0,
            bank = 0,
            blackMoney = 0,
            jobName = 'Unemployed',
            jobGrade = 0,
            playerId = 1,
            inVehicle = false,
            speed = 0,
            gear = 'P',
            fuel = 0,
            rpm = 0,
            nitrous = 0,
            engineHealth = 1000,
            seatbelt = false,
            cruise = false,
            streetName = 'Loading...',
            zoneName = 'Loading...',
            heading = 0,
            x = 0,
            y = 0,
            z = 0,
            onlinePlayers = 1,
            maxPlayers = 48
        }
    })
end)

local seatbeltOn = false
local cruiseOn = false

RegisterCommand(Config.Commands.ToggleHUD or 'togglehud', function()
    hudActive = not hudActive
    SendNUIMessage({
        type = 'toggleUI',
        show = hudActive
    })
    SetNuiFocus(hudActive, hudActive)
end, false)

RegisterCommand(Config.Commands.HUDMenu or 'hudmenu', function()
    SendNUIMessage({
        type = 'toggleHudMenu'
    })
    SetNuiFocus(true, true)
end, false)

RegisterCommand('closehud', function()
    SetNuiFocus(false, false)
end, false)

RegisterKeyMapping(Config.Commands.HUDMenu or 'hudmenu', 'HUD Ayarlar Menüsü', 'keyboard', Config.Keys.HUDMenu or 'J')

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    Wait(500)
    PlayerData = getPlayerData()
    isLoggedIn = true
    
    SendNUIMessage({
        type = 'initConfig',
        config = {
            maxSpeed = Config.Vehicle.MaxSpeed,
            maxRPM = Config.Vehicle.MaxRPM,
            speedUnit = Config.speedMultiplier,
            defaultSettings = Config.HUD.DefaultSettings,
            defaultColors = Config.HUD.DefaultColors
        }
    })
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
    isLoggedIn = false
    
    for key, _ in pairs(LastData) do
        if type(LastData[key]) == 'number' then
            LastData[key] = -1
        elseif type(LastData[key]) == 'string' then
            LastData[key] = ''
        elseif type(LastData[key]) == 'boolean' then
            LastData[key] = false
        else
            LastData[key] = nil
        end
    end
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

RegisterNetEvent('hud:client:UpdateMoney', function(type, amount)
    if PlayerData.money then
        PlayerData.money[type] = amount
    end
end)

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    if PlayerData.metadata then
        PlayerData.metadata['hunger'] = newHunger
        PlayerData.metadata['thirst'] = newThirst
    end
end)

RegisterCommand('seatbelt', function()
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) then
        seatbeltOn = not seatbeltOn
        TriggerEvent('hud:client:ToggleSeatbelt')
    end
end, false)

CreateThread(function()
    local x, y = GetActiveScreenResolution()
    local minimap = RequestScaleformMovie("minimap")
    local defaultAspectRatio = x/y
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local aspectRatio = resolutionX/resolutionY
    local minimapOffset = 0.0100

    if aspectRatio > defaultAspectRatio then
        minimapOffset = ((defaultAspectRatio-aspectRatio)/3.6) + 0.005
    end

    RequestStreamedTextureDict("squaremap", false)

    while not HasStreamedTextureDictLoaded("squaremap") do
        Wait(150)
    end

    SetMinimapClipType(0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "squaremap", "radarmasksm")
    AddReplaceTexture("platform:/textures/graphics", "radarmask1g", "squaremap", "radarmasksm")

    SetMinimapComponentPosition("minimap", "L", "B", 0.0 + minimapOffset, -0.047, 0.1638, 0.183)
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + minimapOffset, 0.0, 0.128, 0.20)
    SetMinimapComponentPosition("minimap_blur", "L", "B", -0.005 + minimapOffset, 0.0243, 0.2589, 0.278)

    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetRadarBigmapEnabled(true, false)
    SetMinimapClipType(0)
    Wait(0)
    SetRadarBigmapEnabled(false, false)

    BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
    Wait(50)
    ScaleformMovieMethodAddParamInt(3)
    EndScaleformMovieMethod()
end)

RegisterKeyMapping('seatbelt', 'Emniyet Kemeri', 'keyboard', Config.Seatbelt.SeatbeltUseKey or 'B')

if Config.CruiseControl.Enabled then
    RegisterCommand('cruise', function()
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            cruiseOn = not cruiseOn
            TriggerEvent('hud:client:ToggleCruise')
        end
    end, false)
    
    RegisterKeyMapping('cruise', 'Hız Sabitleyici', 'keyboard', Config.CruiseControl.Key or 'Y')
end

RegisterNUICallback('updateConfig', function(data, cb)
    if data.hudSettings and data.hudColors then
        TriggerServerEvent('hud:server:SaveSettings', data.hudSettings, data.hudColors)
    end
    cb('ok')
end)

RegisterNUICallback('loadConfig', function(data, cb)
    TriggerFrameworkCallback('hud:server:LoadSettings', function(result)
        cb(result)
    end)
end)

RegisterNUICallback('closehud', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNetEvent('hud:client:ReloadHUD', function()
    SendNUIMessage({
        type = 'reloadHUD'
    })
end)

RegisterNetEvent('hud:client:ToggleSeatbelt', function()
    SendNUIMessage({
        type = 'updateSeatbelt',
        seatbelt = seatbeltOn
    })
end)

RegisterNetEvent('hud:client:ToggleCruise', function()
    SendNUIMessage({
        type = 'updateCruise',
        cruise = cruiseOn
    })
end)
