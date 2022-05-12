const Contest = require('../db/schemes').Contest

/** @TODO : embed list and help (help somwhere else, not in this file)*/

// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&
/** @Sends : list of all contests     |=|  !list contests  |=| */
listContests = async mess => {
    const contests = await Contest.find().lean()
    
    mess.channel.send("contests list")
}

// /** @Sends : Course from database of given @id */
// getCourse = async (req, res) => {
//     try {
//         if(!req.body.id)  return res.sendStatus(400)

//         res.status(202).send(JSON.stringify(
//             await Contest.findById(req.body.id).lean()
//         ))
// }


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Contest to database     |=|  !add contest @name  |=|*/
addContest = async (mess, name) => {
    if(!name)  
        return mess.channel.send("`Invalid argument`")

    const contest = new Contest({ name: name })
    await contest.save()

    mess.channel.send(`Contest ${name} successfully added to list!`)
}

/** @Deletes : Contest from database based on it's name */
deleteContest = async name => {
    if(!name)  
        return mess.channel.send("`Invalid argument`")

    Contest.deleteOne({name: name}, err => {
        if(err) return  mess.channel.send(`Contest ${name} not found`)
        
        mess.channel.send(`Contest ${name} successfully deleted from list!`)
    })
}

module.exports = {
    addContest,
    listContests,
    deleteContest
}