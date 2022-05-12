const Interval = require('../db/schemes').Interval

/** @TODO : Probably gonna change that to serve multiple guilds */

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : interval in days     |=|  !interval  |=| */
getInterval = async mess => {
    const interval = await Interval.findOne({}, {}, { sort: {'created_at' : -1} }).lean()

    mess.channel.send(`\`Current interval is ${interval.days} days\``)
}

/** @Updates : interval.days value in database      |=|  !set  @days  |=|*/
setInterval = async (mess, days) => {
    if(!days)  
        return mess.channel.send("`Invalid argument <days>`")

    const interval = await Interval.findOne({}, {}, { sort: {'created_at' : -1} })

    interval.days = days
    interval.lastContestAt = new Date().toISOString().split('T')[0]
    await interval.save()

    mess.channel.send(`\`Interval successfully changed to ${days} days!\``)
}

module.exports = {
    getInterval,
    setInterval
}