const { SlashCommandBuilder, Embed, EmbedBuilder, Client } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('website')
		.setDescription('Shows the Current Website!'),
		        /**
         * @param {Interaction} interaction 
         */
	async execute(interaction) {
		//await interaction.reply('Pong!');
		interaction.channel.send('Sending Request...').then(async sent => {
			//sent.edit(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
			var exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Website!')
			.setDescription(`The Website is https://comp.boplmods.net!`)
			.setTimestamp()
			.setFooter({ text: 'BoplBot' });
			await interaction.reply({ embeds: [exampleEmbed] });
			await sent.delete();
		});
	},
};