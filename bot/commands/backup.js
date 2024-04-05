const { SlashCommandBuilder, Interaction, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Creates a backup of the accounts file.'),
    async execute(interaction) {
        // Check if the user has admin permissions
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const accountsFilePath = path.join(__dirname, '../../accounts.json');
        const backupDir = path.join(__dirname, 'server', 'backups');
        const backupFileName = `accounts_backup_${Date.now()}.json`;

        // Check if the accounts file exists
        if (!fs.existsSync(accountsFilePath)) {
            return interaction.reply({ content: 'The accounts file does not exist.', ephemeral: true });
        }

        // Create the backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        try {
            // Copy the accounts file to the backup directory
            fs.copyFileSync(accountsFilePath, path.join(backupDir, backupFileName));
            interaction.reply({ content: 'Backup created successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error creating backup:', error);
            interaction.reply({ content: 'An error occurred while creating the backup.', ephemeral: true });
        }
    },
};