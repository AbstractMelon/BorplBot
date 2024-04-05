const { SlashCommandBuilder, Embed, EmbedBuilder, Client } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joinevent')
		.setDescription('Replies with Pong!'),
		        /**
         * @param {Interaction} interaction 
         */
	async execute(interaction) {
		//await interaction.reply('Pong!');
		interaction.channel.send('Pinging...').then(async sent => {
			//sent.edit(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
			var exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Pong!')
			.setDescription(`The ping is ${sent.createdTimestamp - interaction.createdTimestamp}ms!`)
			.setTimestamp()
			.setFooter({ text: 'Hello!' });
			await interaction.reply({ embeds: [exampleEmbed] });
			await sent.delete();
		});
	},
};