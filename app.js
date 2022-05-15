require('dotenv').config()
require("./loaders/mongoose")
const Discord = require("discord.js")
const doodleServices = require("./services/doodleServices")

const messHandler = require("./handlers/messageHandler")


const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })


client.once("ready", () => console.log("\x1b[42m", "Doodles is online!", "\x1b[0m"))

client.on('messageCreate', messHandler)


/** TODO :
 *  - determine prefered aspect ratio
 *  - winner banner
 *  - total points on winner banner
 *  - doodle icon
 *  - more servers compatibility
 */
// check for contests winners every day











client.login(process.env.DISCORD_BOT_TOKEN)