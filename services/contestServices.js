const { MessageEmbed } = require('discord.js')
const { Interval, Contest } = require('../db/schemes')
const embeds = require('./embeds')

/** @TODO : 
 *  - updating list
 *  - _ as spaces
 *  - next command that ends curr contest
*/

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : list of all contests     |=|  !list contests  |=| */
listContests = async mess => {
    const contests = await Contest.find().lean()
    const interval = await Interval.findOne({}, {}, { sort: {'created_at' : -1} }).lean() // get interval for specifying the contests dates

    console.log(interval)
    // if list is empty
    if(!contests[0])
        return mess.channel.send({embeds: [embeds.empty]}) 

    const listEmbed = new MessageEmbed()
    .setColor(process.env.MAIN_COLOR)
    .setTitle(`CURRENT CONTEST TOPIC: ${contests.shift().name}`)

    con_no = 1 // to track date
    // Add entry for every contest, with it's name and date
    contests.forEach(c => {
        const c_date = new Date(interval.lastContestAt.getTime()) // to make a clone
        c_date.setDate(c_date.getDate() + con_no++*interval.days) // to increment date by interval.days
        
        listEmbed.addField("• "+c.name, c_date.toISOString().split('T')[0])  
    })

    mess.channel.send({embeds: [listEmbed]})
}


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Contest to database     |=|  !add @name  |=|*/
addContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument`")

    Contest.create({name: name})
    .then(() => mess.channel.send(`Contest \`${name}\` successfully added to list!`))
    .catch(err => {
        mess.channel.send(`\`There is already a contest with name "${name}"!\``)
        console.log(`Tried to add duplicate contest "${name}"`)
    })
}

/** @Deletes : Contest from database based on it's name     |=|  !delete @name  |=| */
deleteContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument`")

    Contest.findOneAndRemove({name: name}, (err, item) => {
        if(err) return console.log(err)

        if(!item) return  mess.channel.send(`\`Contest "${name}" not found\``)

        
        mess.channel.send(`Contest \`${name}\` successfully deleted from list!`)
    })
}

/** @Updates : order of contests (except the first/current one)     |=|  !update @order [, , , ] |=| */
updateContestList = async (mess, order) => {
    // if(!order)  
    //     return mess.channel.send("`Invalid argument`")

    // Contest.deleteOne({name: name}, err => {
    //     if(err) return  mess.channel.send(`Contest ${name} not found`)
        
    //     mess.channel.send(`Contest ${name} successfully deleted from list!`)
    // })
}

module.exports = {
    addContest,
    listContests,
    deleteContest,
    updateContestList
}