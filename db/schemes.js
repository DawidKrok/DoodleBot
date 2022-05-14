const mongoose = require("mongoose")

const serverSchema = new mongoose.Schema({    
    guildId: String,
    channelId: String,
    // list of all scheduled contests
    namesList: [String],
    // IDs of currently submitted arts
    messIds: [Number], 
    days: {
        type: Number,
        default: 3
    },
    lastContestAt: {
        type: Date,
        default: new Date().toISOString().split('T')[0]
    },
}, {
    versionKey: false
})


// models with declared Schema
const Server = new mongoose.model("Servers", serverSchema)

module.exports = {
    Server
} 