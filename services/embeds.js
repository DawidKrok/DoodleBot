const { MessageEmbed } = require('discord.js')

// Place for custom embeds


const error = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("SERVER SIDE ERROR OCCURED!")
    .setDescription("Contact your local dev about the issue"),
notAuthorized = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("NOT AUTHORIZED!")

module.exports = {
    error,
    notAuthorized
}
