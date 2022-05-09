const prefix = '!'

const messHandler = mess => {
    // check if message was not meant for bot (doesn't starts with the prefix) or was send by a bot
    if(!mess.content.startsWith(prefix) || mess.author.bot) return

    const args = mess.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase() // get the first string from args
    
    if(command == 'test') mess.channel.send("`yes`")
}

module.exports = messHandler