const { Server } = require('../db/schemes')

/** @TODO : Probably gonna change that to serve multiple guilds */

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : interval in days     |=|  !interval  |=| */
getInterval = async mess => {
    const server = await Server.findOne().lean()

    mess.channel.send(`\`Current interval is ${server.days} days\``)
}

/** @Updates : interval.days value in database      |=|  !set  @days  |=|*/
setInterval = async (mess, days) => {
    if(!days || days <= 0)  
        return mess.channel.send("`Invalid argument [DAYS]`")

    const server = await Server.findOne()

    server.days = days
    await server.save()

    mess.channel.send(`Interval successfully changed to ${days} days!`)
}

module.exports = {
    getInterval,
    setInterval
}