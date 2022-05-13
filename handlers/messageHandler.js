require('dotenv').config()
const contestServices = require('../services/contestServices'),
doodleServices = require('../services/doodleServices'),
timeGapServices = require('../services/intervalServices'),
embeds = require('../services/embeds')

const prefix = process.env.PREFIX,
modId = process.env.ADMIN_ID

const messHandler = async mess => {
    try {
        if(mess.channel.id != process.env.CHANNEL_ID)   return

        // check if message was not meant for bot (doesn't starts with the prefix) or was send by a bot
        if(!mess.content.startsWith(prefix) || mess.author.bot) return
        
        // ==============| COMMAND & ARGUMENTS |==============
        const args = mess.content.slice(prefix.length).split(/ +/)
        const command = args.shift().toLowerCase() // get the first string from args
        
        // handling commands
        switch(command) {
            // -------------| HELP |---------------
            case 'help':
                await showHelp(mess)
                break
            // -------------| SUBMIT |---------------
            case 'submit':
                break
            // -------------| LIST |---------------
            case 'list':
                await contestServices.listContests(mess) 
                break
            // -------------| ADD |---------------
            case 'add': // there's only option for adding contests
                if(mess.member.roles.cache.has(modId))
                    await contestServices.addContest(mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -----------| DELETE |--------------
            case 'delete':
                if(mess.member.roles.cache.has(modId))
                    await contestServices.deleteContest(mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -----------| UPDATE |--------------
            case 'update':
                if(mess.member.roles.cache.has(modId))
                    await contestServices.updateContestList(mess, args)
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -------------| INTERVAL GET & SET |---------------
            case 'interval':
                await timeGapServices.getInterval(mess)
                break
            case 'set':
                await timeGapServices.setInterval(mess, args[0])
                break
        }


    } catch (err) {
        mess.channel.send({embeds: [embeds.error]})
        console.log(err)
    }
    // check if message is from channel the bot is supposed to be attached to
}


// -------------| HELP |---------------
showHelp = mess => {
    mess.channel.send({embeds: [embeds.help]})
}


// -------------| LIST COMMAND |---------------
// listCommand = async (mess, args) => {
//     if(mess.member.roles.cache.has(modId)) // check if message is from mod
//         switch (args[0]) {
//             case 'entries':
//                 await doodleServices.listEntries(mess)
//                 break
//             case 'contests':
//                 await contestServices.listContests(mess)
//                 break
//             default:
//                 mess.channel.send(`\`\`\`Did You mean:
//                 - list entries
//                 - list contests
//                 \`\`\``)
//                 break
//         }
//     else 
//         mess.channel.send({embeds: [embeds.notAuthorized]})
// }




module.exports = messHandler