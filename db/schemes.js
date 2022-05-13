const mongoose = require("mongoose")

const serverSchema = new mongoose.Schema({    
    // list of all scheduled contests
    namesList: {
        type: 'array',
        items: { type: String, uniqueItems: true },
    },
    // IDs of currently submitted arts
    messIds: [Number], // perhaps they can be same? /\ \/
    days: {
        type: Number,
        default: 3
    },
    lastContestAt: {
        type: Date,
        default: new Date().toISOString().split('T')[0]
    }
}, {
    versionKey: false
})


// models with declared Schema
const Server = new mongoose.model("Servers", serverSchema)

module.exports = {
    Server
} 