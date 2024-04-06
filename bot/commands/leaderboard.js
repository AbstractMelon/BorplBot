const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const account = require('./account');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard'),

    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        // Read accounts data from JSON file
        const rawData = fs.readFileSync('accounts.json');
        const accounts = JSON.parse(rawData);

        // Sort accounts by Elo rating
        const sortedAccounts = Object.entries(accounts).sort((a, b) => b[1].elo - a[1].elo);

        let embed_thing = new EmbedBuilder()
        .setTitle(`Current leaderboard`)
        .setColor('Random');

        sortedAccounts.forEach(([id, account], index) => {
            embed_thing
            .addFields(
                { name: ' ', value: " "},
                { name: 'User', value: "<@!"+id+">" },
                { name: 'Wins', value: account.wins.toString(), inline: true },
                { name: 'Losses', value: account.losses.toString(), inline: true },
                { name: 'Elo', value: account.elo.toString(), inline: true }
            );
        });
        
        await interaction.reply({ embeds: [embed_thing] });

        /*
        // Prepare leaderboard message
        let leaderboardMessage = 'Leaderboard:\n';
        sortedAccounts.forEach(([id, account], index) => {
            leaderboardMessage += `${index + 1}. ${account.username} - Elo: ${account.elo}\n`;
        });

        // Send leaderboard message
        await interaction.reply(leaderboardMessage);    
        */
    },
};