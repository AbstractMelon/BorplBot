const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match_command')
        .setDescription('Your command description')
        ,
    async execute(interaction, client) {
    },
};
