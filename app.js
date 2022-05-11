require('dotenv').config()
require("./loaders/mongoose")
const Discord = require("discord.js")

const messHandler = require("./handlers/messageHandler")


const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })


client.once("ready", () => {
    console.log("\x1b[42m", "Doodles is online!", "\x1b[0m")
})

client.on('messageCreate', messHandler)
















client.login(process.env.DISCORD_BOT_TOKEN)