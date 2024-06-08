const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const axios = require('axios');
const createEmbedMessage = require('../createEmbedMessage');

async function handleGongCommand(interaction, serverQueue, queue) {
    const query = interaction.options.getString('query');
    const youtubeApiKey = 'AIzaSyDNCN2E-UgwrRARAcfWWuB548YsKFyCxCA';
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply('You need to be in a voice channel to play music!');
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return interaction.reply('I need the permissions to join and speak in your voice channel!');
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 5,
                q: query,
                type: 'video',
                key: youtubeApiKey
            }
        });

        const videos = response.data.items.map(item => ({
            label: item.snippet.title.length > 100 ? item.snippet.title.slice(0, 97) + '...' : item.snippet.title,
            description: `Uploaded by: ${item.snippet.channelTitle}`,
            value: JSON.stringify({ videoId: item.id.videoId, thumbnail: item.snippet.thumbnails.high.url })
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Select a video to play or add to queue')
                    .addOptions(videos)
            );

        await interaction.reply({
            content: 'Please select the video you would like to play:',
            components: [row],
            ephemeral: true
        });
    } catch (error) {
        console.error(error);
        interaction.reply('There was an error searching YouTube.');
    }
}

module.exports = { handleGongCommand };
