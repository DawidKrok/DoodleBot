const { MessageEmbed } = require('discord.js')

// Place for custom embeds

//---------| COLORS |-----------
const alertColor = process.env.ALERT_COLOR,
mainColor = process.env.MAIN_COLOR

//---------| EMBEDS |-----------
const error = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("SERVER SIDE ERROR OCCURED!")
    .setDescription("Contact your local dev about the issue"),

notAuthorized = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("NOT AUTHORIZED!"),

empty = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("CONTESTS LIST IS EMPTY!")
    .setDescription(`Use \`${process.env.PREFIX}add [NAME]\` to change that`),

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
            name: "`"+process.env.PREFIX+"list`", 
            value: "\nLists all scheduled contests " 
        },
        {
            name: "`"+process.env.PREFIX+"submit `", 
            value: "@TODO : submission system" 
        },
        {
            name: "`=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=`",
            value: "`COMMANDS BELOW REQUIRE AUTHENTICATED ROLE`\n**`=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=`**" 
        },
        {
            name: "`"+process.env.PREFIX+"add [NAME]`\nAdds contest to a list in database ", 
            value: "• NAME - name of the contest to add"
        },
        {
            name: "`"+process.env.PREFIX+"delete [NAME]`\ndeletes contest from list in database ", 
            value: "• NAME - name of the contest to delete \n(can't delete the current contest) \n(to delete a submitted art just remove it from chat)" 
        },
        
        {
            name: "`"+process.env.PREFIX+"set [DAYS]`\nSets the interval between contests", 
            value: "• DAYS - Number of days that each contest will take from now on (including current one).\n`WARNING:` If the current contest is already running longer than the newly set interval, it will end and the next one will start." 
        },
        {
            name: "`"+process.env.PREFIX+"update [ORDER]`\nUpdates ORDER of contests", 
            value: "• ORDER - new arrangement of the list (e.g. Order of contests looks like: `1 2 3 4 5 6 7`, so to swap contests type `1 5 2 4 3`)\n(Doesn't affect the current contest)" 
        },
        {
            name: "`AUTHORS:`", 
            value: "Doodle Bot made by [OMICRON](https://github.com/DawidKrok)" 
        },
    )

module.exports = {
    error,
    notAuthorized,
    empty,
    help,
}
