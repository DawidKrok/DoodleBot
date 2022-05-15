const Discord = require("discord.js")
const { Server } = require('../db/schemes')
const embeds = require('./embeds')
const Canvas = require('canvas')

/** @TODO : checking if doodle was deleted 
 *  - pin winning message
*/

const r1 = '🔥', r2='🎨', r3='🧐', r4 = '🦎'

let background
Canvas.loadImage('./rescources/winners_bg.png').then(img => background = img) // path like for app.js
Canvas.registerFont('./rescources/Roboto-Black.ttf', {family: "Roboto"}) // load Roboto font

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

/** showsWinners in every Server 
 * @is_channel : whether client is channel or discord client */
showWinners = async (client, is_channel = false) => {
    const server = await Server.findOne()

    if(!is_channel) {
        const guild = await client.guilds.cache.get(process.env.GUILD_ID)
        channel = await guild.channels.cache.get(process.env.CHANNEL_ID)
    } else 
        channel = client

    // --------------| DETERMINING WINNER |-------------
    if(server.messIds.length != 0) {
        winners = [] // array of current contest winners
        highest_score = 0
        // count score of every art
        await Promise.all(server.messIds.map(async m_id => {
            await channel.messages.fetch(m_id.toString())
            .then(mess => {
                r = mess.reactions.cache
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
                // message was not found (probably deleted)
                if(err.httpStatus == '404') return
    
                channel.send({embeds: [embeds.error]})
                console.log(err)
            })
        }))
    
        // send information about tie (more than one art with the same score)
        if(winners.length > 1)
            channel.send({embeds: [embeds.tie]})
    
        await drawWinnersCanvas(winners, server.namesList[0])

    } else // noone submited art :c
        channel.send({embeds: [embeds.noArt]})

    server.messIds = []
    // ------------| NEXT CONTEST |-----------
    // remove current contest from list
    server.namesList.shift()
    server.save()
        
    if(server.namesList==0) // no contests on the list
        return channel.send({embeds: [embeds.empty]})

    // send information about next contest
    channel.send({embeds: [
        new Discord.MessageEmbed()
            .setColor(process.env.MAIN_COLOR)
            .setTitle(`The next contest is: ${server.namesList[0]}`)
    ]})
}
/** draws a picture with winning art, name of @contest and author's name and avatar   */
drawWinnersCanvas = async (winners, contest) => {
    await Promise.all(winners.map(async mess => {
        const canvas =  Canvas.createCanvas(1000, 900),
        ctx = canvas.getContext('2d'),
        avatar = await Canvas.loadImage(mess.author.displayAvatarURL({ format: 'jpg' })),
        art = await Canvas.loadImage(mess.attachments.first().attachment)

        // put everything on canva
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        
        //----------| PUTTING TEXT |----------
        ctx.font = "75px 'Roboto'"
        ctx.strokeStyle = "rgb(27, 11, 59)"
        ctx.lineWidth = 20
        ctx.fillStyle = "white"
        // Contest Name
        ctx.lineWidth = 14
        ctx.strokeText(contest, 300, 85)
        ctx.fillText(contest, 300, 85)
        // Author Name
        ctx.font = "50px 'Roboto'"
        ctx.strokeText(mess.author.username, 200, 790)
        ctx.fillText(mess.author.username, 200, 790)

        //----------| ADDING IMAGE |----------
        ctx.drawImage(art, 225, 135, 550, 550)


        //----------| AVATAR CY(R)CLE |----------
        ctx.beginPath()
        ctx.arc(875, 775, 50, 0, Math.PI*2, true)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar, 825, 725, 100, 100)

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "winner.png")
        await mess.channel.send({files: [attachment]})
        .then(msg => msg.pin()) // pin message [\[\[ and delete information about bot pinning message ]/]/]
    }))
}


module.exports = {
    addEntry,
    showWinners
}