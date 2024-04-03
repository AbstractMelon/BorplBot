// friendcode.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, setUserData, isValidFriendCode } = require('../utils/helpers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friendcode')
        .setDescription('Set or get friend code.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Get friend code of a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to get friend code for'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your friend code.')
                .addStringOption(option =>
                    option
                        .setName('code')
                        .setDescription('Your friend code')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'get') {
                const user = interaction.options.getUserData('user');
                const memberData = getUserData(user.id);

                if (!memberData || !memberData.code) {
                    await interaction.reply(`${user.username} has not set their friend code yet!`);
                    return;
                }

                await interaction.reply(`${user.username}'s friend code is: ${memberData.code}`);
            } else if (subcommand === 'set') {
                const code = interaction.options.getString('code');

                if (!isValidFriendCode(code)) {
                    await interaction.reply('Invalid friend code! Please provide a valid friend code!.');
                    return;
                }

                const userId = interaction.user.id;
                setUserData(userId, { code });
                await interaction.reply(`Your friend code has been set to: ${code}`);
            }
        } catch (error) {
            console.error('Error executing friendcode command:', error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
