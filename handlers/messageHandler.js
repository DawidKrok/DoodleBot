require('dotenv').config()

const prefix = process.env.PREFIX,
modId = process.env.ADMIN_ID

const messHandler = mess => {
    // check if message is from channel the bot is supposed to be attached to
    if(mess.channel.id != process.env.CHANNEL_ID)   return

    // check if message was not meant for bot (doesn't starts with the prefix) or was send by a bot
    if(!mess.content.startsWith(prefix) || mess.author.bot) return

    const args = mess.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase() // get the first string from args
    
    if(mess.member.roles.cache.has(modId)) { // check if message is from mod
        mess.channel.send("```It's a Mod```")
    }

    if(command == 'test') mess.channel.send("`yes`")
}

module.exports = messHandler