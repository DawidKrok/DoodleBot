const { MessageEmbed } = require('discord.js')
const { Server } = require('../db/schemes')
const embeds = require('./embeds')

/** @TODO : checking if doodle was deleted */



// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Entry to database     |=|  !submit @attached_image  |=|*/
addEntry = async mess => {
    if(mess.attachments.size == 0)
        return mess.channel.send("`Attach art to Your submission`")
    if(mess.attachments.size > 1)
        return mess.channel.send("`Cannot submit more than one art`")
    console.log(mess.attachments)
   

    Server.updateOne({}, {
        $addToSet: {messIds: mess.id}
    }, (err, data) => {
        // just in case I guess?
        if(err || !data.modifiedCount) {
            mess.channel.send({embeds: [embeds.error]})
            return console.log(err? err : "doodleServices.AddEntry() : for some reason art wasn't submitted")
        }

        mess.channel.send({embeds : [embeds.artSubmitted]})
        .then(msg => setTimeout(() => msg.delete(), 4000))
        .catch(err => console.log(err))
    })
}

showWinners = async mess => {

}


module.exports = {
    addEntry
}