const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Your command description')
        // Add any other options or configurations here
        ,
    async execute(interaction, client) {
        // Your command execution logic goes here
    },
};
