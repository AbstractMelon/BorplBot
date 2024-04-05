const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Get the data
function readAccountsData() {
    try {
        console.log('Reading accounts data...');
        const data = fs.readFileSync('accounts.json', 'utf8');
        console.log('Accounts data read successfully.');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts data:', error);
        throw error;
    }
}

// Do Ever cooler Stuff
function getRandomTeam(accounts) {
    try {
        console.log('Getting random team...');
        const accountIds = Object.keys(accounts).filter(id => id !== 'accounts');
        const randomAccountId = accountIds[Math.floor(Math.random() * accountIds.length)];
        console.log('Random team selected successfully.');
        return accounts[randomAccountId];
    } catch (error) {
        console.error('Error getting random team:', error);
        throw error;
    }
}

// do epic stuff
function pairTeams(accounts) {
    try {
        console.log('Pairing teams...');
        const pairedUsers = [];
        const matchlist = [];

        // Get account IDs excluding the 'accounts' key
        const accountIds = Object.keys(accounts).filter(id => id !== 'accounts');

        // Shuffle the account IDs randomly
        const shuffledIds = shuffleArray(accountIds);

        // Iterate through shuffled IDs
        shuffledIds.forEach(userId => {
            const user = accounts[userId];
            let matches = 0;
            let index = 0;

            // Loop until finding suitable opponents or exhausting all options
            while (matches < 2 && index < shuffledIds.length) {
                const opponentId = shuffledIds[index];
                const opponent = accounts[opponentId];
                index++;

                // Check if the opponent is not the same as the user, not already paired, and has not reached the match limit
                if (userId !== opponentId && !pairedUsers.includes(opponentId) && matches < 2) {
                    matchlist.push({ teams: [user.username, opponent.username], elo_diff: Math.abs(user.elo - opponent.elo) });
                    pairedUsers.push(userId, opponentId);
                    matches++;
                }
            }
        });

        console.log('Teams paired successfully.');
        return matchlist;
    } catch (error) {
        console.error('Error pairing teams:', error);
        throw error;
    }
}

// Function to shuffle array elements randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('matchlist')
        .setDescription('Shows the current matchlist!'),

    async execute(interaction) {
        try {
            console.log('Executing matchlist command...');
            const accounts = readAccountsData();

            // Generate matchlist
            const matchlist = pairTeams(accounts);
            console.log('Matchlist generated successfully.');

            interaction.channel.send('Requesting...').then(async sent => {
                let matchlistString = ""; // Makes stuff
                matchlist.forEach((match, index) => {
                    matchlistString += `${index + 1}. ${match.teams[0]} vs ${match.teams[1]} (Elo Diff: ${match.elo_diff})\n`; // Make the Matchlist
                });

                // Creating the embed
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('THE CURRENT MATCHLIST IS:\n') //done touch this
                    .setDescription(matchlistString)
                    .setTimestamp()
                    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/wSTFkRM.png' });

                // Sending the embed
                console.log('Sending embed...');
                await interaction.reply({ embeds: [exampleEmbed] });
                console.log('Embed sent successfully.');
                await sent.delete();
                console.log('Original message deleted successfully.');
            });
        } catch (error) {
            console.error('Error executing matchlist command:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    },
};