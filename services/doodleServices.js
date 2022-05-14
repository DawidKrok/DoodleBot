const { Server } = require('../db/schemes')
const embeds = require('./embeds')
const Canvas = require('canvas')

/** @TODO : checking if doodle was deleted 
 *  - pin winning message
*/

const r1 = '🔥', r2='🎨', r3='🧐', r4 = '🦎'

// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Entry to database     |=|  !submit @attached_image  |=|*/
addEntry = async mess => {
    if(mess.attachments.size == 0)
        return mess.channel.send("`Attach art to Your submission`")
    if(mess.attachments.size > 1)
        return mess.channel.send("`Cannot submit more than one art`")
    if(mess.attachments.first().contentType.split("/")[0] != 'image') // check if attachment is an image
        return mess.channel.send("`Attachment must be an image`")

    mess.react(r1).then(()=>mess.react(r2).then(mess.react(r3).then(mess.react(r4))))
    
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

// showsWinners in every Server
showWinners = async client => {
    const server = await Server.findOne()
    
    const guild = await client.guilds.cache.get(process.env.GUILD_ID)
    const channel = await guild.channels.cache.get(process.env.CHANNEL_ID)

    winners = [] // array of current contest winners
    highest_score = 0
    await Promise.all(server.messIds.map(async m_id => {
        await channel.messages.fetch(m_id.toString())
        .then(mess => {
            r = mess.reactions.cache
            // console.log(mess.attachments.first().attachment)
            score = r.get(r1).count + r.get(r2).count + r.get(r3).count + r.get(r4).count - 4
            console.log(score)

            if(score > highest_score) {
                winners = [mess] // reset winners array
                highest_score = score
            }
            else if(score == highest_score)
                winners.push(mess)
        })
        .catch(err => {
            channel.send({embeds: [embeds.error]})
            console.log(err)
        })
    }))

    if(winners.length > 1)
        channel.send("IT'S A TIE!")

    // drawWinnersCanvas(winners)
}

drawWinnersCanvas = async (winners) => {
    winners.forEach(mess => {
        new Canvas.Canvas()
    });    
}


module.exports = {
    addEntry,
    showWinners
}