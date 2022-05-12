const { MessageEmbed } = require('discord.js')
const { Interval, Contest } = require('../db/schemes')
const embeds = require('./embeds')

/** @TODO : 
 *  - updating list
 *  - _ as spaces
 *  - next command that ends curr contest
 *  - update help on chaniging list just to the 4th elem
 *  - end the contest command
*/

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : list of all contests     |=|  !list contests  |=| */
listContests = async mess => {
    const interval = await Interval.findOne().lean() // get interval for specifying the contests dates
    let contests = await Contest.findOne().lean()

    contests = contests.namesList // because reasons

    // if list is empty
    if(!contests[0])
        return mess.channel.send({embeds: [embeds.empty]}) 

    const listEmbed = new MessageEmbed()
    .setColor(process.env.MAIN_COLOR)
    .setTitle(`CURRENT CONTEST TOPIC: ${contests.shift()}`)

    con_no = 1 // to track date
    // Add entry for every contest, with it's name and date
    contests.forEach(c => {
        const c_date = new Date(interval.lastContestAt.getTime()) // to make a clone
        c_date.setDate(c_date.getDate() + con_no++*interval.days) // to increment date by interval.days
        
        listEmbed.addField("• "+c, c_date.toISOString().split('T')[0])  
    })

    mess.channel.send({embeds: [listEmbed]})
}


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Contest to database     |=|  !add @name  |=|*/
addContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument``[NAME]`")

    Contest.updateOne({}, {
        $addToSet: {namesList: name}
    }, (err, data) => {
        if(err) return console.log(err)

        // if name was added there'll be modifiedCount set in data to 1
        if(!data.modifiedCount)     // list wasn't modified => name was a duplicate  
            return mess.channel.send(`\`There is already a contest with name "${name}"!\``)
        
        mess.channel.send(`Contest \`${name}\` successfully added to list!`)
    })
}

/** @Deletes : Contest from list in database based on it's name     |=|  !delete @name  |=| */
deleteContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument [NAME]`")

    Contest.updateOne({}, {
        $pull: {namesList: name}
    },(err, item) => {
        if(err) return console.log(err)

        if(!item.modifiedCount) return  mess.channel.send(`\`Contest "${name}" not found\``)
        
        mess.channel.send(`Contest \`${name}\` successfully deleted from list!`)
    })
}

/** @Updates : order of contests (except the first/current one)     |=|  !update @order [, , , ] |=| */
updateContestList = async (mess, order) => {
    if(!order) // order[0] 
        return mess.channel.send("`Invalid argument [ORDER]`")

    contests = await Contest.findOne().lean()
    console.log(contests)

}

module.exports = {
    addContest,
    listContests,
    deleteContest,
    updateContestList
}