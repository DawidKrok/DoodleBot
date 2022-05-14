const mongoose = require("mongoose")

const serverSchema = new mongoose.Schema({    
    guildId: String,
    channelId: String,
    // Roles that have access to extra commands
    authorizedRolesIds: [Number], 
    
    // list of all scheduled contests
    namesList: [String],
    // IDs of currently submitted arts
    messIds: [String], 
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