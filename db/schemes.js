const mongoose = require("mongoose")

// Object with information about contests
const contestSchema = new mongoose.Schema({    
    name: {
        type: String,
        unique: true,
    }
}, {
    _id: false,
    versionKey: false
})

// Doodles are pointers to messages submited to given contest
const doodleSchema = new mongoose.Schema({
    messId: Number,
    constestId: mongoose.ObjectId
}, {
    versionKey: false
})



// models with declared Schema
const Contest = new mongoose.model("Contest", contestSchema)
const Doodle = new mongoose.model("Doodle", doodleSchema)


module.exports = {
    Contest,
    Doodle,
} 