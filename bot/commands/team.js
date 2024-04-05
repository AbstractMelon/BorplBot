const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Manage team accounts')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new team')
                .addStringOption(option =>
                    option.setName('teamname')
                        .setDescription('Name of the team')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('View team stats')
                .addUserOption(option =>
                    option.setName('selecteduser')
                        .setDescription('User to get stats of.')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete team')
        )
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('player')
                .setDescription('Manage team players')
                .addSubcommand(subsubcommand =>
                    subsubcommand
                        .setName('add')
                        .setDescription('Add a player to the team')
                        .addUserOption(option =>
                            option.setName('player')
                                .setDescription('Player to add to the team')
                                .setRequired(true)
                        )
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'create':
                await createTeam(interaction);
                break;
            case 'stats':
                await viewTeamStats(interaction);
                break;
            case 'delete':
                await deleteTeam(interaction);
                break;
            case 'player':
                await manageTeamPlayers(interaction);
                break;
            default:
                await interaction.reply('Invalid subcommand.');
        }
    },
};

async function createTeam(interaction) {
    const teamName = interaction.options.getString('teamname');
    const teamId = interaction.guildId;

    let teams = {};
    try {
        const data = fs.readFileSync('teams.json');
        teams = JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams.json:', error);
    }

    if (teams[teamId]) {
        await interaction.reply('Team already exists.');
        return;
    }

    teams[teamId] = {
        name: teamName,
        wins: 0,
        losses: 0,
        players: []
    };

    fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2));

    await interaction.reply(`Team ${teamName} created successfully!`);
}


async function viewTeamStats(interaction) {
    const teamId = interaction.guildId;

    let teams = {};
    try {
        const data = fs.readFileSync('teams.json');
        teams = JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams.json:', error);
    }

    const team = teams[teamId];
    if (!team) {
        await interaction.reply('No stats found for this team.');
        return;
    }

    const embed = new EmbedBuilder()
        .setDescription(`### ${team.name} Stats`)
        .setColor('Random')
        .addFields(
            { name: 'Wins', value: team.wins.toString(), inline: true },
            { name: 'Losses', value: team.losses.toString(), inline: true }
        );

    await interaction.reply({ embeds: [embed] });
}

async function deleteTeam(interaction) {
    const teamId = interaction.guildId;

    let teams = {};
    try {
        const data = fs.readFileSync('teams.json');
        teams = JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams.json:', error);
    }

    if (!teams[teamId]) {
        await interaction.reply('No team found to delete.');
        return;
    }

    delete teams[teamId];

    try {
        fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2));
        await interaction.reply('Team deleted successfully.');
    } catch (error) {
        console.error('Error writing teams.json:', error);
        await interaction.reply('An error occurred while trying to delete the team.');
    }
}

async function manageTeamPlayers(interaction) {
    const subsubcommand = interaction.options.getSubcommand();

    switch (subsubcommand) {
        case 'add':
            await addPlayerToTeam(interaction);
            break;
        default:
            await interaction.reply('Invalid subsubcommand.');
    }
}

async function addPlayerToTeam(interaction) {
    const teamId = interaction.guildId;
    const playerId = interaction.options.getUser('player').id;

    let teams = {};
    try {
        const data = fs.readFileSync('teams.json');
        teams = JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams.json:', error);
    }

    const team = teams[teamId];
    if (!team) {
        await interaction.reply('Team not found.');
        return;
    }

    if (team.players.includes(playerId)) {
        await interaction.reply('Player already in the team.');
        return;
    }

    team.players.push(playerId);

    try {
        fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2));
        await interaction.reply('Player added to the team successfully.');
    } catch (error) {
        console.error('Error writing teams.json:', error);
        await interaction.reply('An error occurred while trying to add the player to the team.');
    }
}