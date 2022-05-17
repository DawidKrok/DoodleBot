const { MessageEmbed } = require('discord.js')
const { Server } = require('../db/schemes')
const embeds = require('./embeds')

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Shows : list of all contests     |=|  !list  |=| */
listContests = async (server, mess) => {
    contests = server.contestsList 

    // if list is empty
    if(!contests[0])
        return mess.channel.send({embeds: [embeds.empty]}) 

    const listEmbed = new MessageEmbed()
    .setColor(process.env.MAIN_COLOR)
    .setTitle(`CURRENT CONTEST TOPIC: ${contests.shift().name}`)

    // Add entry for every contest, with it's name and date
    contests.forEach(c => {
        server.lastContestAt.setDate(server.lastContestAt.getDate() + server.interval) // to increment date by interval.days
        
        listEmbed.addField("• "+c.name, server.lastContestAt.toISOString().split('T')[0])  
    })

    mess.channel.send({embeds: [listEmbed]})
}

/** @Shows : name, description and rules of contest    |=|  !info @name  |=| */
showContestInfo = (server, mess, name) => {
    contest = server.contestsList.filter(c => c.name == name)[0]

    if(!contest)
        return mess.channel.send(`\`There is no contest with name "${name}"!\``)

    // send information about contest
    mess.channel.send({embeds: [
        embeds.makeContestInfoEmbed(name, contest.description, contest.rules, false, false) // false for date and false for extra data
    ]})
}


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Contest to database     |=|  !add @name  |=|*/
addContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument [NAME]`")

    name = name.replace(/_/g, ' ')

    Server.updateOne({guildId: mess.guild.id, 'contestsList.name': {$ne: name}}, {
        $addToSet: {contestsList: {name: name}}
    }, (err, data) => {
        if(err) return console.log(err)

        // if name was added there'll be modifiedCount set in data to 1
        if(!data.modifiedCount)     // list wasn't modified => name was a duplicate  
            return mess.channel.send(`\`There is already a contest with name "${name}"!\``)
        
        mess.channel.send(`Contest \`${name}\` successfully added to list!`)
    })
}

/** @Sets : description of contest     |=|  !description @name @description  |=|*/
setDescription = async (server, mess, args) => {
    if(!args[0])  
        return mess.channel.send("`Invalid argument [NAME]`")

    if(!args[1])  
        return mess.channel.send("`No [DESCRIPTION] provided`")

    name = args.shift().replace(/_/g, ' ')

    index = server.contestsList.findIndex(con => con.name == name)

    if(index < 0)
        return mess.channel.send(`\`There is no contest with name "${name}"!\``)

    server.contestsList[index].description = args.join(' ')

    await server.save()
    mess.channel.send(`Contest \`${name}\` successfully updated!`)
}

/** @Sets : rules of contest     |=|  !rules @name @rules  |=|*/
setRules = async (server, mess, args) => {
    if(!args[0])  
        return mess.channel.send("`Invalid argument [NAME]`")

    if(!args[1])  
        return mess.channel.send("`No [RULES] provided`")

    name = args.shift().replace(/_/g, ' ')

    index = server.contestsList.findIndex(con => con.name == name)

    if(index < 0)
        return mess.channel.send(`\`There is no contest with name "${name}"!\``)

    server.contestsList[index].rules = args.join(' ')

    await server.save()
    mess.channel.send(`Contest \`${name}\` successfully updated!`)
}

/** @Deletes : Contest from list in database based on it's name     |=|  !delete @name  |=| */
deleteContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument [NAME]`")

        name = name.replace(/_/g, ' ')

    Server.updateOne({guildId: mess.guild.id}, {
        $pull: {contestsList: {name: name}}
    },(err, item) => {
        if(err) return console.log(err)

        if(!item.modifiedCount) return  mess.channel.send(`\`Contest "${name}" not found\``)
        
        mess.channel.send(`Contest \`${name}\` successfully deleted from list!`)
    })
}

/** @Updates : order of contests (except the first/current one)     |=|  !update @order [, , , ] |=| */
updateContestList = async (server, mess, order) => {
    if(!order[0])    return mess.channel.send("`Invalid argument [ORDER]`")
    
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

module.exports = {
    listContests,
    showContestInfo,
    addContest,
    deleteContest,
    setDescription,
    setRules,
    updateContestList,
    changeOrder
}