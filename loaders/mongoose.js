const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
    // some settings for better mongoose performance
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    autoIndex: true,
}).then(
    () => console.log("\x1b[42m", "Connected with MongoDB", "\x1b[0m \n"),
    err => console.log(err)
)