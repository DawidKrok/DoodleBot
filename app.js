require('dotenv').config()
require("./loaders/mongoose")
const Discord = require("discord.js")
const Cron = require('cron')
const { Server } = require('./db/schemes')
const doodleServices = require("./services/doodleServices")
const guildServices = require("./services/guildServices")

const messHandler = require("./handlers/messageHandler")


const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })


client.once("ready", () => console.log("\x1b[42m", "Doodles is online!", "\x1b[0m"))

client.on('messageCreate', messHandler)

// on joining guild
client.on('guildCreate', guild => guildServices.addServer(guild))
// on leaving guild
client.on('guildDelete', guild => guildServices.removeServer(guild))

/** TODO :
 *  - determine prefered aspect ratio
 *  - winner banner
 *  - total points on winner banner
 *  - doodle icon
 *  - more servers compatibility
 *  - determine at what time to check winners
 */
// check for contests winners every day
const checkWinners = new Cron.CronJob('0 0 0 * * *', async () => {
    const server = await Server.findOne().lean()
    // difference in days
    difference = Math.ceil((new Date().getTime() - server.lastContestAt.getTime()) / (1000 * 3600 * 24))
    // compare difference to interval 
    
    if(difference >= server.interval)
        doodleServices.showWinners(client)
})


checkWinners.start()



client.login(process.env.DISCORD_BOT_TOKEN)