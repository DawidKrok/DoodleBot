const { MessageEmbed } = require('discord.js')

// Place for custom embeds

//---------| COLORS |-----------
const alertColor = "#ff0000",
mainColor = "#8338ec"

//---------| EMBEDS |-----------
const error = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("SERVER SIDE ERROR OCCURED!")
    .setDescription("Contact your local dev about the issue"),

notAuthorized = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("NOT AUTHORIZED!"),

help = new MessageEmbed()
    .setColor(mainColor)
    .setTitle("DOODLES BOT HELP")
    .setDescription("Doodles Bot manages simple art contests on this server. \nAuthenticated person can set a list of contests. \nMembers can participate in them by submitting their art and voting for the best submission.\n\nVOTING SYSTEM:")
    .addFields(
        {
            name: "Submitted art is rated based on it's reactions", 
            value: "@TODO : reaction system (few important ones and all the rest done like 10 for one bonus point or smth)\n\nCOMMANDS:" 
        },
        {
            name: "`"+process.env.PREFIX+"submit `", 
            value: "@TODO : submission system" 
        },
        {
            name: "`=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=`",
            value: "`COMMANDS BELOW REQUIRE AUTHENTICATED ROLE`" 
        },
        {
            name: "`"+process.env.PREFIX+"delete [CONTEST]`\ndeletes CONTEST from list in a database ", 
            value: "• CONTEST - name of the contest to delete (to delete a submitted art just remove it from chat)" 
        },
        {
            name: "`"+process.env.PREFIX+"list [COLLECTION]`\nList all elements belonging to the selected COLLECTION ", 
            value: "COLLECTIONS:\n• `contests` - lists all contests\n• `entries` - lists all entries submitted by server members for current contest" 
        },
        {
            name: "`"+process.env.PREFIX+"set [DAYS]`\nSets the interval between contests", 
            value: "• DAYS - Number of days that each contest will take from now on (including current one).\nWARNING: If the current contest is already running longer than the newly set interval, it will end and th next one will start." 
        },
        {
            name: "`"+process.env.PREFIX+"update [ORDER]`\nUpdates ORDER of contests in list", 
            value: "• ORDER - new arrangement of the list (e.g. Order of contests looks like: `1 2 3 4 5`, so to swap two contests type `1 5 3 4 2`)" 
        },
        {
            name: "`AUTHORS:`", 
            value: "Doodle Bot made by [OMICRON](https://github.com/DawidKrok)" 
        },
    )

module.exports = {
    error,
    notAuthorized,
    help
}
