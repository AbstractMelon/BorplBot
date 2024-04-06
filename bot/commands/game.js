const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// Map to store players who have joined the game
const players = new Map();

// Function to check if two players have joined
const checkPlayersJoined = () => players.size === 2;

// Function to handle the game logic

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Start a new game')
        .addSubcommand(subcommand =>
            subcommand.setName('start')
                .setDescription('Start a game')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Your friend code')
                        .setRequired(false),
                )
        ),

    async execute(interaction) { // Corrected
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'join': {
                const friendCode = interaction.options.getString('friend_code');
                players.set(interaction.user, friendCode);
                await interaction.reply({ content: 'Joined the game!', ephemeral: true });
                if (checkPlayersJoined()) {
                    await handleGame(interaction);
                }
                break;
            }
            default:
                break;
        }
    },
    async handleGame(interaction) {
        if (!checkPlayersJoined()) {
            await interaction.reply({ content: 'Waiting for players to join...', ephemeral: true });
            return;
        }
    
        // Send friend codes to each player
        players.forEach(async (friendCode, player) => {
            const otherPlayer = [...players.keys()].find(p => p !== player);
            const otherFriendCode = players.get(otherPlayer);
            const message = `Your friend code: ${friendCode}\nYour opponent's friend code: ${otherFriendCode}`;
            await player.send(message);
        });
    
        // Send embed with voting options
        const team1Players = [...players.keys()].slice(0, 1).join('\n'); // Corrected
        const team2Players = [...players.keys()].slice(1).join('\n'); // Corrected
        const embed = new MessageEmbed()
            .setTitle('Vote for the winner')
            .setDescription('Choose the winner of the game')
            .addField('Team 1', team1Players)
            .addField('Team 2', team2Players);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
