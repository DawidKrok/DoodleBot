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

noArt = new MessageEmbed()
    .setColor(alertColor)
    .setTitle("THERE WAS NO ART SUBMITTED FOR THIS CONTEST!"),

artSubmitted = new MessageEmbed()
    .setColor(mainColor)
    .setTitle("ART SUCCESSFULLY SUBMITTED!"),

tie = new MessageEmbed()
    .setColor(mainColor)
    .setTitle("IT'S A TIE!"),

help = new MessageEmbed()
    .setColor(mainColor)
    .setTitle("DOODLES BOT HELP")
    .setDescription("Doodles Bot manages simple art contests on this server. \nAuthenticated person can set a list of contests. \nMembers can participate in them by submitting their art and voting for the best submission.\n\nVOTING SYSTEM:")
    .addFields(
        {
            name: "Submitted art is rated based on it's reactions", 
            value: "Reacting with one of emojis listed below adds 1 point to the art's score:\n• 🧐 - for smart idea\n• 🔥 - for great execution\n• 🎨 - for visible skills\n• 🦎 - for lizard\nThe art with the most points at the end of the contest wins.\n\nCOMMANDS:" 
        },
        {
            name: "`"+process.env.PREFIX+"interval`", 
            value: "Sends the interval between contests (in days) " 
        },
        {
            name: "`"+process.env.PREFIX+"list`", 
            value: "\nLists all scheduled contests " 
        },
        {
            name: "`"+process.env.PREFIX+"submit`", 
            value: "Submits attached art to the contest. Reactions under this message will determine its score.\n(PUT PREFERED ASPECT RATIO)" 
        },
        {
            name: "`=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+`",
            value: "`COMMANDS BELOW REQUIRE AUTHORIZED ROLE`\n**`=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+`**" 
        },
        {
            name: "`"+process.env.PREFIX+"authorize [ROLE_NAME]`\nAuthorizes a role  ", 
            value: "• ROLE_NAME - name of the role to authorize. From now on everyone with this role can use commands from this list.\n(Owner of server is always authorized)"
        },
        {
            name: "`"+process.env.PREFIX+"unauthorize [ROLE_NAME]`\nUnauthorizes a role", 
            value: "• ROLE_NAME - name of the role to unauthorize."
        },
        {
            name: "`"+process.env.PREFIX+"add [NAME]`\nAdds contest to a list in database ", 
            value: "• NAME - name of the contest to add. Use '_' for spaces (e.g. NAME `Cool_lizard` is converted to `Cool lizard`)."
        },
        {
            name: "`"+process.env.PREFIX+"delete [NAME]`\ndeletes contest from list in database", 
            value: "• NAME - name of the contest to delete. Use '_' for spaces \n(can't delete the current contest) \n(to delete a submitted art just remove it from chat)" 
        },
        {
            name: "`"+process.env.PREFIX+"set [DAYS]`\nSets the interval between contests", 
            value: "• DAYS - Number of days that each contest will take from now on (including current one).\n`WARNING:` If the current contest is already running longer than the newly set interval, it will end and the next one will start.\nSetting DAYS to '0' ends current contest without changing previously set interval" 
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
    noArt,
    artSubmitted,
    tie,
    help,
}
