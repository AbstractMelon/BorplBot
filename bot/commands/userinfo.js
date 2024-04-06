const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_command')
        .setDescription('Your command description')
        ,
    async execute(interaction, client) {
    },
};
