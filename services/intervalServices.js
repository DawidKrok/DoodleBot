const { showWinners } = require('./doodleServices')

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
    else if(days == 0) {
        channel = mess.guild.channels.cache.get(server.channelId)
        if(!channel) return mess.channel.send("Use `!channel [CHANNEL_NAME]` to specify a channel for art submissions and winners announces") // channel saved in server.channelId was deleted

        return showWinners(channel)
    }

    server.interval = days
    await server.save()

    mess.channel.send(`Interval successfully changed to ${days} days!`)
}

module.exports = {
    getInterval,
    setInterval
}