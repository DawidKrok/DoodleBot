const { MessageEmbed } = require('discord.js')
const { Server } = require('../db/schemes')
const embeds = require('./embeds')

/** @TODO : 
 *  - _ as spaces
*/

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : list of all contests     |=|  !list contests  |=| */
listContests = async mess => {
    const server = await Server.findOne().lean()

    contests = server.namesList // because Promise

    // if list is empty
    if(!contests[0])
        return mess.channel.send({embeds: [embeds.empty]}) 

    const listEmbed = new MessageEmbed()
    .setColor(process.env.MAIN_COLOR)
    .setTitle(`CURRENT CONTEST TOPIC: ${contests.shift()}`)

    con_no = 1 // to track date
    // Add entry for every contest, with it's name and date
    contests.forEach(c => {
        const c_date = new Date(server.lastContestAt.getTime()) // to make a clone
        c_date.setDate(c_date.getDate() + con_no++*server.days) // to increment date by interval.days
        
        listEmbed.addField("• "+c, c_date.toISOString().split('T')[0])  
    })

    mess.channel.send({embeds: [listEmbed]})
}


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Contest to database     |=|  !add @name  |=|*/
addContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument``[NAME]`")

    name = name.replace(/_/g, ' ')

    Server.updateOne({}, {
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

        name = name.replace(/_/g, ' ')

    Server.updateOne({}, {
        $pull: {namesList: name}
    },(err, item) => {
        if(err) return console.log(err)

        if(!item.modifiedCount) return  mess.channel.send(`\`Contest "${name}" not found\``)
        
        mess.channel.send(`Contest \`${name}\` successfully deleted from list!`)
    })
}

/** @Updates : order of contests (except the first/current one)     |=|  !update @order [, , , ] |=| */
updateContestList = async (mess, order) => {
    if(!order[0])    return mess.channel.send("`Invalid argument [ORDER]`")

    server = await Server.findOne()
    
    try {
        server.namesList = changeOrder(server.namesList, order)
        await server.save()

        mess.channel.send("Contests list successfully updated!")
    } catch (error) {
        console.log(`updateContestListErr: ${error}`)
        switch(error) {
            case "NaI":
                mess.channel.send("`Every argument of [ORDER] must be an integer`")   
                break
            case "Exceeded":
                mess.channel.send("`Every argument of [ORDER] must be greater than 0 and less than the number of the last entry`")   
                break
            case "Duplicate":
                mess.channel.send("`[ORDER] must be formed by consecutive integers`")   
                break
        }
    }
}

/** change order of array (except first element) based on passed order
 * @array : array to change
 * @order : new order in a form of array with integers, e.g. [4, 3, 1, 2] */
changeOrder = (array, order) => {
    max_n = order.length
    updatedList = [array[0]]

    order.forEach(n => {
        // check for invalid indexes in order
        if(n <= 0 || n > max_n || n >= array.length)     
            throw "Exceeded"

        // check if elem is already in updated List. That means that order is not made of consecutive integers
        if(updatedList.includes(array[n]))
            throw "Duplicate"
        
        // check for non integer values
        if(!Number.isInteger(Number(n)))
            throw "NaI"

        updatedList.push(array[n])
    })

    // add all names that were not included in order (only if there's still something to add because array.slice(0) returns whole array)
    return array.length == updatedList.length? updatedList : updatedList.concat(array.slice(updatedList.length - array.length))
}
/** ==================| ENDING CONTEST |================ */
// endContest = () => {
//
// }

module.exports = {
    addContest,
    listContests,
    deleteContest,
    updateContestList,
    changeOrder
}