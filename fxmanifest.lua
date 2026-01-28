fx_version "adamant"

description "Hugo Roleplay HUD"
author "chiaroscuric"
version '1.1.0'

game "gta5"

shared_script "main/shared.lua"

client_script { 
"main/client.lua"
}

server_script {
'@mysql-async/lib/MySQL.lua',
"main/server.lua",
}


ui_page "index.html"

files {
    'index.html',
    'vue.js',
    'assets/**/*.*',
    'assets/font/*.otf',  
}

escrow_ignore { 'main/shared.lua' }

lua54 'yes'
-- dependency '/assetpacks'