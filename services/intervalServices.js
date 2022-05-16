const { Server } = require('../db/schemes')
const { showWinners } = require('./doodleServices')

/** @TODO : Probably gonna change that to serve multiple guilds */

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : interval in days     |=|  !interval  |=| */
getInterval = async (server, mess) => {
    mess.channel.send(`\`Current interval is ${server.interval} days\``)
}

/** @Updates : interval.days value in database      |=|  !set  @days  |=|*/
setInterval = async (server, mess, days) => {
    if(days < 0 || !Number.isInteger(Number(days)))  
        return mess.channel.send("`Invalid argument [DAYS]`")

    // starting next contest
    else if(days == 0) 
        return showWinners(mess.guild.channels.cache.get(server.channelId))

    server.interval = days
    await server.save()

    mess.channel.send(`Interval successfully changed to ${days} days!`)
}

module.exports = {
    getInterval,
    setInterval
}