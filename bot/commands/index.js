const fs = require('fs');
const { Collection } = require('discord.js');

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');

const commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./${file}`);
    commands.set(command.name, command);
}

module.exports = commands;
