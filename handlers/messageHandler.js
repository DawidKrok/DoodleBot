require('dotenv').config()
const { Server } = require('../db/schemes')
const contestServices = require('../services/contestServices'),
doodleServices = require('../services/doodleServices'),
intervalServices = require('../services/intervalServices'),
guildServices = require('../services/guildServices'),
embeds = require('../services/embeds')

const prefix = process.env.PREFIX

const messHandler = async mess => {
    try {
        // check if message was not meant for bot (doesn't starts with the prefix) or was send by a bot
        if(!mess.content.startsWith(prefix) || mess.author.bot) return
        
        // ==============| COMMAND & ARGUMENTS |==============
        const args = mess.content.slice(prefix.length).split(/ +/)
        const command = args.shift().toLowerCase() // get the first string from args

        const server = await Server.findOne({guildId: mess.guild.id})

        // determine if user is authorized
        authorized = mess.guild.ownerId == mess.author.id // if author is owner

        if(!authorized) // if author is not an owner
            server.authorizedRolesIds.forEach(r_id => {
                if(mess.member.roles.cache.has(r_id))
                    authorized = true
            })


        // handling commands
        switch(command) {
            // -------------| HELP |---------------
            case 'help':
                mess.channel.send({embeds: [embeds.help]})
                break
            // -------------| SUBMIT ART |---------------
            case 'submit':
                // if message was send on the right channel, or no channel was specified
                if(mess.channel.id == server.channelId || !server.channelId )
                    await doodleServices.addEntry(server, mess)
                break
            // -------------| LIST CONTESTS |---------------
            case 'list':
                await contestServices.listContests(server, mess) 
                break
            // -------------| SHOW INFO |---------------
            case 'info':
                await contestServices.showContestInfo(server, mess, args[0]) 
                break
            // -------------| ADD CONTEST |---------------
            case 'add': 
                if(authorized)
                    await contestServices.addContest(mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -----------| DELETE CONTEST |--------------
            case 'delete':
                if(authorized)
                    await contestServices.deleteContest(mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            case 'description':
                if(authorized)
                    await contestServices.setDescription(server, mess, args)
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            case 'rules':
                if(authorized)
                    await contestServices.setRules(server, mess, args)
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -----------| UPDATE CONTEST ORDER |--------------
            case 'update':
                if(authorized)
                    await contestServices.updateContestList(server, mess, args)
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -------------| INTERVAL GET & SET |---------------
            case 'interval':
                await intervalServices.getInterval(server, mess)
                break
            case 'set':
                if(authorized)
                    await intervalServices.setInterval(server, mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -------------| ADD / REMOVE ROLE |---------------
            case 'authorize':
                if(authorized)
                    await guildServices.addRole(mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            case 'unauthorize':
                if(authorized)
                    await guildServices.removeRole(server, mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
            // -------------| SET SONTESTS CHANNEL |---------------
            case 'channel':
                if(authorized)
                    await guildServices.setChannel(server, mess, args[0])
                else 
                    mess.channel.send({embeds: [embeds.notAuthorized]})   
                break
        }
    } catch (err) {
        mess.channel.send({embeds: [embeds.error]})
        console.log(err)
    }
}



// -------------| LIST COMMAND |---------------
// listCommand = async (mess, args) => {
//     if(authorized) // check if message is from mod
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