const mongoose = require("mongoose")

// Object with information about contests
const contestSchema = new mongoose.Schema({    
    namesList: {
        type: 'array',
        items: { type: String, uniqueItems: true },
    }
}, {
    versionKey: false
})

// Doodles are pointers to messages submited to given contest
const doodleSchema = new mongoose.Schema({
    messIds: [Number]
}, {
    versionKey: false
})

// for saving how often coontests should occur
const intervalSchema = new mongoose.Schema({    
    days: Number,
    lastContestAt: Date
}, {
    versionKey: false
})


// models with declared Schema
const Contest = new mongoose.model("Contest", contestSchema)
const Doodle = new mongoose.model("Doodle", doodleSchema)
const Interval = new mongoose.model("Interval", intervalSchema)


module.exports = {
    Contest,
    Doodle,
    Interval,
} 