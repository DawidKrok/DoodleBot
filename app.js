const Discord = require("discord.js")
const messHandler = require("./handlers/messageHandler")

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })


client.once("ready", () => {
    console.log("\x1b[42m", "Doodles is online!", "\x1b[0m")
})

client.on('messageCreate', messHandler)


















client.login("OTczMjA3NTc0NjUwNDQ1ODg0.GQRoAD.wEi6z0mbrxv2D8J8o-GLaVOMYu4b4H6deOK9X4")