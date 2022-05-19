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
 *  - fix craching on wrong permissions
 *  - determine at what time to check winners
 */
// check for contests winners in every server every day
const checkWinners = new Cron.CronJob('0 0 0 * * *', async () => {
    servers = await Server.find({}).lean()
    servers.forEach(server => {
        if(!server.channelId)   return // for now(?)(dunno what to do here)

        // difference in days
        difference = Math.ceil((new Date().getTime() - server.lastContestAt.getTime()) / (1000 * 3600 * 24))
        
        // compare difference to interval 
        if(difference >= server.interval)
            doodleServices.showWinners(client.channels.cache.get(server.channelId))
    })
})


checkWinners.start()



client.login(process.env.DISCORD_BOT_TOKEN)