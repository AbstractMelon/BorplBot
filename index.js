const { token } = require('./config');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, ], });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is serving in ${client.guilds.cache.size} guild(s)`);
    client.user.setActivity('Bopl Battle!');
});

client.on('debug', console.debug);
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => {
    console.log('Bot disconnected from Discord.');
});
client.on('reconnecting', () => {
    console.log('Bot reconnecting to Discord...');
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);
