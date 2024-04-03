const { SlashCommandBuilder } = require('@discordjs/builders');
const { getMemberByUsername } = require('../utils/helpers');
const { readUsers, writeUsers } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friendcode')
        .setDescription('Set or get friend code.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your friend code.')
                .addStringOption(option => option.setName('code').setDescription('Your friend code.'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Get friend code of a user.')
                .addStringOption(option => option.setName('username').setDescription('The username to get friend code.'))
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'set') {
            const code = interaction.options.getString('code');
            const userId = interaction.user.id;
            
            // Save friend code to database
            const users = readUsers();
            users[userId] = { code };
            writeUsers(users);
            
            await interaction.reply(`Your friend code has been set to: ${code}`);
        } else if (subcommand === 'get') {
            const username = interaction.options.getString('username');
            const member = await getMemberByUsername(interaction.guild, username);
            
            if (!member) {
                await interaction.reply('User not found!');
                return;
            }
            
            const userId = member.id;
            const users = readUsers();
            
            if (!users[userId] || !users[userId].code) {
                await interaction.reply('This user has not set their friend code yet!');
            } else {
                await interaction.reply(`Friend code of ${member.user.username}: ${users[userId].code}`);
            }
        }
    },
};
