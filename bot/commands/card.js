const { SlashCommandBuilder } = require('@discordjs/builders');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { AttachmentBuilder } = require('discord.js'); // Import AttachmentBuilder from discord.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Generate an image with user profile picture and leaderboard rank'),
    async execute(interaction, client) {
        const user = interaction.user;

        // Generate a random color for the background
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        // Create a canvas
        const canvas = Canvas.createCanvas(400, 200);
        const ctx = canvas.getContext('2d');

        // Draw background
        ctx.fillStyle = randomColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        try {
            // Fetch user's profile picture
            const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: false });
            console.log("Avatar URL:", avatarURL); // Log the avatar URL for debugging
            
            // Convert webp to png
            const response = await fetch(avatarURL);
            const buffer = await response.buffer();
            const pngBuffer = await sharp(buffer).toFormat('png').toBuffer();

            const avatar = await Canvas.loadImage(pngBuffer);
            ctx.drawImage(avatar, 25, 25, 100, 100);
        } catch (error) {
            console.error("Error loading avatar:", error); // Log any errors that occur
            return interaction.reply({ content: "Error generating image. Please try again later.", ephemeral: true });
        }

        // Add leaderboard rank (dummy example)
        const leaderboardRank = "1st"; // Retrieve the actual leaderboard rank here

        // Draw leaderboard rank
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Leaderboard Rank: ${leaderboardRank}`, 150, 75);

        // Convert canvas to buffer
        const buffer = canvas.toBuffer();

        // Create an AttachmentBuilder using buffer
        const attachment = new AttachmentBuilder(buffer, { name: 'generated_image.png' });

        // Send the image in the channel
        await interaction.channel.send({ content: `Here's your generated image, ${user.username}`, files: [attachment] });
    },
};
