const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Object to store game lobbies
const lobbies = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startgame')
        .setDescription('Registers a game lobby'),

    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        try {
            // Create buttons for team selection
            const team1Button = new ButtonBuilder()
                .setCustomId('team1')
                .setLabel('Join Team 1')
                .setStyle(ButtonStyle.Primary);

            const team2Button = new ButtonBuilder()
                .setCustomId('team2')
                .setLabel('Join Team 2')
                .setStyle(ButtonStyle.Primary);

            // Add buttons to an action row
            const teamRow = new ActionRowBuilder()
                .addComponents(team1Button, team2Button);

            // Send initial message with team selection options
            await interaction.reply({
                embeds: [new EmbedBuilder()  // Using EmbedBuilder for embed creation
                    .setColor('#0099ff')
                    .setTitle('Game')
                    .setDescription('Choose your team:')
                ],
                components: [teamRow]
            });

            // Store lobby data
            if (!lobbies[interaction.guildId]) {
                lobbies[interaction.guildId] = {
                    team1: [],
                    team2: [],
                    votes: {}
                };
            }

            await interaction.deferReply();

            // Collect user interactions
            const collector = interaction.channel.createMessageComponentCollector({
                componentType: 'Button',
                time: 60000 // 1 minute timeout
            });

            collector.on('collect', async buttonInteraction => {
                try {
                    await buttonInteraction.deferReply();
                    // Check if the user is already in a team
                    const alreadyJoined = Object.values(lobbies[interaction.guildId]).some(team => team.includes(buttonInteraction.user.id));
                    if (alreadyJoined) {
                        await buttonInteraction.reply({
                            content: 'You have already joined a team!',
                            ephemeral: true
                        });
                        return;
                    }

                    // Handle team selection
                    if (buttonInteraction.customId === 'team1' || buttonInteraction.customId === 'team2') {
                        const team = buttonInteraction.customId === 'team1' ? 'team1' : 'team2';
                        lobbies[interaction.guildId][team].push(buttonInteraction.user.id);

                        await buttonInteraction.reply({
                            content: `You joined ${team.toUpperCase()}!`,
                            ephemeral: true
                        });
                    }

                    // Handle vote
                    else if (buttonInteraction.customId.startsWith('vote_')) {
                        const votedUser = buttonInteraction.customId.split('_')[1];
                        lobbies[interaction.guildId].votes[buttonInteraction.user.id] = votedUser;

                        await buttonInteraction.reply({
                            content: `You voted for ${votedUser}!`,
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    console.error('Error processing button interaction:', error);
                    
                }
            });

            collector.on('end', () => {
                console.log('Game lobby ended');
                // TODO: Handle end of collection (e.g., voting period ends)
                // TODO: Give ELO to players
            });

        } catch (error) {
            console.error('Error executing game command:', error);
            await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
        }
    },
};