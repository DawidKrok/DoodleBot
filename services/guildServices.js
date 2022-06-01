const { Server } = require("../db/schemes")

// for settuping a new guild
addServer = guild => {
    // find the first text channel on the server
    let channel = guild.channels.cache.filter(ch => ch.type == 'GUILD_TEXT').first()

    const server = new Server({
        guildId: guild.id,
        channelId: channel?.id // in case no text channel is on server
    })
    
    console.log("Joined guild "+guild.name)

    server.save()
}

removeServer = guild => {
    Server.deleteOne({guildId: guild.id}).catch(err => console.log(err))
    console.log("Left guild "+guild.name)
}

addRole = async (server, mess, role_name) => {
    if(!role_name)  
        return mess.channel.send("`Invalid argument [ROLE]`")

    role_name = role_name.replace(/_/g, ' ') // replace '_' with spaces

    // find role by id
    const role = mess.guild.roles.cache.find(r => r.name == role_name)
    if(!role) 
        return mess.channel.send(`\`Role "${role_name}" not found\``)

    if(server.authorizedRolesIds.indexOf(role.id) >= 0)
        return mess.channel.send(`\`"${role_name}" is already authorized!\``)

    // add role id to list
    server.authorizedRolesIds.push(role.id)
    await server.save()

    mess.channel.send(`\`${role_name}\` successfully authorized`)
}

removeRole = async (server, mess, role_name) => {
    if(!role_name)  
        return mess.channel.send("`Invalid argument [ROLE]`")

    role_name = role_name.replace(/_/g, ' ') // replace '_' with spaces

    // find role by id
    const role = mess.guild.roles.cache.find( r => r.name == role_name)
    if(!role) 
        return mess.channel.send(`\`Role "${role_name}" not found\``)

    // filter will leave only ids that are not id of role from input
    server.authorizedRolesIds = server.authorizedRolesIds.filter(id => id != role.id)
    await server.save()

    mess.channel.send(`\`${role_name}\` successfully unauthorized`)

}

setChannel = async (server, mess, channel_name) => {
    if(!channel_name)  
        return mess.channel.send("`Invalid argument [CHANNEL]`")

    channel_name = channel_name.replace(/_/g, ' ') // replace '_' with spaces

    // find role by id
    const channel = mess.guild.channels.cache.find(r => r.name == channel_name)
    if(!channel) 
        return mess.channel.send(`\`Channel "${channel_name}" not found\``)

    // add role id to list
    server.channelId = channel.id
    await server.save()

    mess.channel.send(`\`${channel_name}\` successfully set as contests channel`)
}

module.exports = {
    addServer,
    removeServer,
    addRole,
    removeRole,
    setChannel
}