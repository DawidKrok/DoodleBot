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

// addRole = role => {
//     const server = Server.findOne()
// }

module.exports = {
    addServer,
    removeServer
}