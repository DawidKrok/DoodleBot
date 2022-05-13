const { MessageEmbed } = require('discord.js')
const { Server } = require('../db/schemes')
const embeds = require('./embeds')

/** @TODO : checking if doodle was deleted */



// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Entry to database     |=|  !add @name  |=|*/
addEntry = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument``[NAME]`")

    Server.updateOne({}, {
        $addToSet: {namesList: name}
    }, (err, data) => {
        if(err) return console.log(err)

        // if name was added there'll be modifiedCount set in data to 1
        if(!data.modifiedCount)     // list wasn't modified => name was a duplicate  
            return mess.channel.send(`\`There is already a contest with name "${name}"!\``)
        
        mess.channel.send(`Contest \`${name}\` successfully added to list!`)
    })
}


module.exports = {
    addEntry
}