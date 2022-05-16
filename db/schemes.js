const mongoose = require("mongoose")

const serverSchema = new mongoose.Schema({    
    guildId: {
        type: String,
        unique: true
    },
    // channelId: Number,
    // Roles that have access to extra commands
    authorizedRolesIds: [String], 
    
    // list of all scheduled contests
    contestsList: [{
        _id: false,
        name: {
            type: String,
            unique: true
        },
        description: String,
        rules: String
    }],
    // IDs of currently submitted arts
    messIds: [String], 
    interval: {
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