const { ObjectId } = require("mongoose")
const { Server } = require("../db/schemes")

// for settuping a new guild
addServer = guild => {
    const server = new Server({
        guildId: guild.id,
        authorizedRolesIds: [guild.ownerId]
    })
    
    console.log("Joined guild "+guild.name)

    server.save()
}

removeServer = guild => {
    Server.deleteOne({guildId: guild.id}).catch(err => console.log(err))
    console.log("Left guild "+guild.name)
}

addRole = async (mess, role_name) => {
    if(!role_name)  
        return mess.channel.send("`Invalid argument [ROLE]`")

    const server = await Server.findOne({guildId: mess.guild.id})
    // find role by id
    const role = mess.guild.roles.cache.find( r => r.name == role_name)
    // add role id to list
    server.authorizedRolesIds.push(role.id)
    server.save()
}

removeRole = async (mess, role_name) => {
    if(!role_name)  
        return mess.channel.send("`Invalid argument [ROLE]`")
        
    const server = await Server.findOne({guildId: mess.guild.id})
    // find role by id
    const role = mess.guild.roles.cache.find( r => r.name == role_name)
    // filter will leave only ids that are not id of role from input
    server.authorizedRolesIds = server.authorizedRolesIds.filter(id => id != role.id)
    server.save()
}

module.exports = {
    addServer,
    removeServer,
    addRole,
    removeRole
}