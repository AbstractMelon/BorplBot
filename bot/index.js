const { Client, Events, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { token, clientId, guildId } = require('./config');

console.log("Bot starting...")


module.exports.bot = () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

    console.log("Timestamp Loading started!")

    const log = (message) => {
        console.log(`[${new Date().toLocaleString()}] ${message}`);
    };

    console.log("Timestamp Loading done")


    // Register slash commands
    console.log("Command Loading started!")
    const commands = [];
    const commandFiles = fs.readdirSync(path.resolve("./bot/commands")).filter(e => e.endsWith(".js"));

    commandFiles.forEach((file) => {
        const command = require(path.resolve("./bot/commands/", file));
        commands.push(command);
        log(`Registered command: ${command.name}`);
    });


    const commandBodies = commands.map(command => JSON.stringify(command));


    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandBodies })
        .then(() => log('Successfully registered application commands.'))
        .catch(error => {
            console.error('Failed to register application commands:', error);
            log('Failed to register application commands');
        });

    client.on("interactionCreate", async (interaction) => {
        try {
            if (interaction.isCommand()) {
                const command = commands.find(cmd => cmd.data.name === interaction.commandName);
                if (command) {
                    await command.execute(interaction, client);
                    log(`Executed command: ${command.data.name}`);
                }
            }
        } catch (error) {
            console.error('Error executing command:', error);
            log('Error executing command');
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    client.once(Events.ClientReady, readyClient => {
        log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.Error, error => {
        console.error('Client error:', error);
        log('Client error');
    });

    client.on(Events.Warning, warning => {
        console.warn('Client warning:', warning);
        log('Client warning');
    });

    client.login(token);

    return { client };
};
