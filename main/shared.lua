Config = {}
Config.Framework = "NewESX"

-- Debug ve Performance Ayarları
Config.Debug = false -- Production'da false olmalı
Config.Performance = {
    StatusUpdateInterval = 1000, -- ms
}

Config.speedMultiplier = 'KM/H'

Config.HUD = {
    UpdateInterval = 100,
    PlayerCountUpdateInterval = 10000,
    DefaultSettings = {
        showHealth = true,
        showArmor = true,
        showHunger = true,
        showThirst = true,
        showMoney = true,
        showVehicle = true,
        showLocation = true,
        showPlayerCount = true
    },
    DefaultColors = {
        health = { r = 239, g = 68, b = 68 },
        armor = { r = 59, g = 130, b = 246 },
        fuel = { r = 245, g = 158, b = 11 },
        nitrous = { r = 6, g = 182, b = 212 },
        speed = { r = 16, g = 185, b = 129 },
        hunger = { r = 249, g = 115, b = 22 },
        thirst = { r = 6, g = 182, b = 212 }
    }
}

Config.GetVehFuel = function(vehicle)
    return GetVehicleFuelLevel(vehicle)
end

Config.Vehicle = {
    MaxSpeed = 300,
    MaxRPM = 8500,
    UseFuelSystem = true,
    UseNitroSystem = true
}

Config.Commands = {
    ToggleHUD = 'togglehud',
    HUDMenu = 'hudmenu'
}

Config.Keys = {
    HUDMenu = 'F1'
}

function GetFramework()
    local Get = nil
    if Config.Framework == "ESX" then
        while Get == nil do
            TriggerEvent('esx:getSharedObject', function(Set) Get = Set end)
            Citizen.Wait(0)
        end
    elseif Config.Framework == "NewESX" then
        Get = exports['es_extended']:getSharedObject()
    elseif Config.Framework == "QBCore" then
        Get = exports["qb-core"]:GetCoreObject()
    elseif Config.Framework == "OLDQBCore" then
        while Get == nil do
            TriggerEvent('QBCore:GetObject', function(Set) Get = Set end)
            Citizen.Wait(200)
        end
    end
    return Get
end

Config.SpeedDisplay = {
    kmh = 3.6,
    mph = 2.23694
}

Config.Seatbelt = {
    AlarmOnlyAirVehicles = false,
    HarnessUseKey = 'G',
    SeatbeltUseKey = 'B'
}

Config.CruiseControl = {
    Enabled = true,
    Key = 'Y'
}