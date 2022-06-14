const Discord = require("discord.js")
const { Server } = require('../db/schemes')
const embeds = require('./embeds')
const Canvas = require('canvas')


const r1 ='🔥', r2='🎨', r3='🧐', r4 = '🦎'

let background
Canvas.loadImage('./rescources/winner_banner.PNG').then(img => background = img) // path like for app.js
Canvas.registerFont('./rescources/Roboto.ttf', {family: "Roboto"}) // load Roboto font
Canvas.registerFont('./rescources/Handlee.ttf', {family: "Handlee"}) // load Handlee font

// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Entry to database     |=|  !submit @attached_image  |=|*/
addEntry = async (server, mess) => {
    if(mess.attachments.size == 0)
        return mess.channel.send("`Attach art to Your submission`")
    if(mess.attachments.size > 1)
        return mess.channel.send("`Cannot submit more than one art`")
    if(mess.attachments.first().contentType.split("/")[0] != 'image') // check if attachment is an image
        return mess.channel.send("`Attachment must be an image`")

    // --------------| ADD REACTIONS |--------------
    try {
        if(!mess.channel.permissionsFor(mess.guild.me).has("ADD_REACTIONS")) 
            mess.channel.send("Missing permission `ADD_REACTIONS`")
        else
            mess.react(r1).then(()=>mess.react(r2).then(mess.react(r3).then(mess.react(r4))))
    } catch(err) {} // in case message is deleted during emotes assigning
    
    server.messIds.push(mess.id)
    await server.save()
    
    mess.channel.send({embeds : [embeds.artSubmitted]})
    .then(msg => setTimeout(() => msg.delete(), 4000))
    .catch(err => console.log(err))
}

/** showsWinners in every Server 
 * @is_channel : whether client is channel or discord client */
showWinners = async (channel) => {
    if(!channel) return

    const server = await Server.findOne({channelId: channel.id})
    
    if(!server)   return channel.send("Use `!channel [CHANNEL_NAME]` to specify a channel for art submissions and winners announces")

    if(!channel.permissionsFor(channel.guild.me).has("ATTACH_FILES")) 
            return channel.send("Missing permission `MANAGE_CHANNELS` (cannot attach winner banner)")


    // --------------| DETERMINING WINNER |-------------
    if(server.messIds.length != 0) {
        winners = [] // array of current contest winners
        highest_score = 0
        // count score of every art
        await Promise.all(server.messIds.map(async m_id => {
            await channel.messages.fetch(m_id.toString())
            .then(mess => {
                r = mess.reactions.cache
                score = r.get(r1)?.count + r.get(r2)?.count + r.get(r3)?.count + r.get(r4)?.count - 4
    
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
    
        await drawWinnersCanvas(winners, server.contestsList[0]?.name, highest_score)

    } else // noone submitted art :c. in a case that contest ends, but bot was still assigning emotes to the only one submission, it won't fire (score = undefined => no winners) Not worth fixing
        channel.send({embeds: [embeds.noArt]})

    server.messIds = []
    server.lastContestAt = new Date().toISOString().split('T')[0] // reset date of last contest

    // ------------| NEXT CONTEST |-----------
    // remove current contest from list
    server.contestsList.shift()
    await server.save()
        
    if(server.contestsList==0) // no contests on the list
        return channel.send({embeds: [embeds.empty]})

    // for embed purpose: determining deadline of new curr contest
    server.lastContestAt.setDate(server.lastContestAt.getDate() + server.interval)
    const nextDate = server.lastContestAt.toISOString().split('T')[0]
    
    channel.send("NEW CONTEST:")
    // send information about next contest
    channel.send({embeds: [
        embeds.makeContestInfoEmbed(server.contestsList[0].name, server.contestsList[0].description, server.contestsList[0].rules, nextDate)
    ]})
}
/** draws a picture with winning art, name of @contest , points, author's name and avatar   */
drawWinnersCanvas = async (winners, contest_name, score) => {
    const contest_name_x = 570, contest_name_y = 240,
    avatar_x = 660, avatar_y = 2275, avatar_r = 100,
    art_max_h = 1450, art_max_w = 2100

    await Promise.all(winners.map(async mess => {
        const canvas =  Canvas.createCanvas(2500, 2500),
        ctx = canvas.getContext('2d'),
        avatar = await Canvas.loadImage(mess.author.displayAvatarURL({ format: 'jpg' })),
        art = await Canvas.loadImage(mess.attachments.first().attachment)

        // put winner_banner on canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        
        //----------| PUTTING TEXT |----------
        ctx.fillStyle = "white"
        // Contest Name
        ctx.font = getFittingFont(`"${contest_name}"`, fontface='Handlee', width= canvas.width-contest_name_x, max_fontsize=225, context = ctx)
        ctx.fillText(`"${contest_name}"`, contest_name_x, contest_name_y)

        // Author Name
        ctx.font = getFittingFont(mess.author.username, fontface='Roboto', width=910, max_fontsize=125, context = ctx)
        ctx.fillText(mess.author.username, avatar_x + 150, avatar_y+50)

        // points
        ctx.textAlign = "center"
        ctx.font = "125px 'Roboto'"
        ctx.fillText(score, 1860, 2290)


        //----------| ADDING IMAGE |----------
        aspectRatio = art.width/art.height

        if(aspectRatio < art_max_w/art_max_h) // vertical
            ctx.drawImage(art, canvas.width/2 - art_max_h*aspectRatio/2, 300, art_max_h*aspectRatio, art_max_h)
        else // horizontal
            ctx.drawImage(art, 200, 1025 - art_max_w/aspectRatio/2, art_max_w, art_max_w/aspectRatio)


        //----------| AVATAR CY(R)CLE |----------
        ctx.beginPath()
        ctx.arc(avatar_x, avatar_y, avatar_r, 0, Math.PI*2, true)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar, avatar_x - avatar_r, avatar_y - avatar_r, 2*avatar_r, 2*avatar_r)



        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "winner.png")
        await mess.channel.send({files: [attachment]})
        .then(msg => {
            if(!mess.channel.permissionsFor(mess.guild.me).has("MANAGE_CHANNELS")) 
                return mess.channel.send("Missing permission `MANAGE_CHANNELS` (cannot pin winners)")
            
            msg.pin()
        }) // pin message [\[\[ and delete information about bot pinning message ]/]/]
    }))
}

// function by markE from StackOverflow
getFittingFont = (text, fontface, width, max_fontsize, context) => {
    fontsize = max_fontsize+1

    do {
        fontsize--
        context.font = fontsize + "px " + fontface
    } while (context.measureText(text).width > width)

    return fontsize + "px " + fontface
}


module.exports = {
    addEntry,
    showWinners
}