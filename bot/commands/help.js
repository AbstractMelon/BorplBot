const { SlashCommandBuilder } = require('discord.js');
const help = {
    "help": { short: "Sends a list of commands and what they do. Optionally you can specify the command you want a description of." },
    "ping": { short: "Replies with pong", long: 'A very basic command that replies to your message with "pong".' },
    "game": { short: "stats a game lobby", long: 'Starts a game lobby for you to start playing.' },
    "leaderboard": { short: "Displays the leaderboard", long: 'Shows the leaderboard of top players.' },
    "user": { short: "View others accounts!", long: 'View others accounts!"' },
    "account create": { short: "Creates a new account", long: 'Creates a new user account.' },
    "account delete": { short: "Deletes your account", long: 'Deletes your user account.' },
    "account stats": { short: "Displays account statistics", long: 'Shows statistics related to your user account.' }
};

var helpString = "Here are the available commands:\n"
for(let i = 0;i<Object.keys(help).length;i++){
    helpString+="/"+Object.keys(help)[i]+" - " +help[Object.keys(help)[i]].short+ "\n"
}

const helpEmbed = {
    color: 0x0099ff,
    title: 'Command List',
    description: helpString
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows help')
        .addStringOption(option =>
			option
				.setName('command')
				.setDescription('Optional option for specifying command.')),
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        if(interaction.options.getString('command')==""||!interaction.options.getString('command')){
            await interaction.reply({ embeds: [helpEmbed],ephemeral: true });
        }else{
            if(!help[interaction.options.getString('command')]){
                await interaction.reply({embeds:[{
                    color: 0x0099ff,
                    title: 'Help',
                    description: "That command doesn't exist or have a help definition for it!"
                }],
                ephemeral: true
            })
                return
            }
            await interaction.reply({embeds:[{
                color: 0x0099ff,
                title: 'Help',
                description: "/"+interaction.options.getString('command')+" - " +(help[interaction.options.getString('command')].long?help[interaction.options.getString('command')].long:help[interaction.options.getString('command')].short)+ "\n"
            }],
            ephemeral: true})
        }
    },
};
