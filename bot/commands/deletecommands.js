const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletecommands')
        .setDescription('Delete all global and private commands.'),

    async execute(interaction) {
        try {
            console.log('Executing deletecommands command...');

            // Delete all global commands
            await interaction.client.application.commands.fetch()
                .then(commands => {
                    commands.forEach(async command => {
                        await command.delete();
                    });
                });

            // Delete all private commands
            await interaction.guild.commands.fetch()
                .then(commands => {
                    commands.forEach(async command => {
                        await command.delete();
                    });
                });

            console.log('All commands deleted successfully.');
            await interaction.reply('All commands have been deleted.');
        } catch (error) {
            console.error('Error executing deletecommands command:', error);
            await interaction.reply('An error occurred while deleting commands.');
        }
    },
};
