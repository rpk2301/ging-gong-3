const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const play = require('play-dl');
const createEmbedMessage = require('../createEmbedMessage');
const playSong = require("../playSong");

async function handleGingCommand(interaction, serverQueue, queue) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply('You need to be in a voice channel to play music!');
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return interaction.reply('I need the permissions to join and speak in your voice channel!');
    }

    try {
        const songInfo = await play.video_info(url);
        const song = {
            title: songInfo.video_details.title,
            url: songInfo.video_details.url,
            thumbnail: songInfo.video_details.thumbnails[0].url,
            requestedBy: interaction.member.nickname || interaction.user.username
        };

        const embed = createEmbedMessage(song, serverQueue);

        if (!serverQueue) {
            const queueContruct = {
                textChannel: interaction.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                player: createAudioPlayer(),
            };

            queue.set(interaction.guildId, queueContruct);
            queueContruct.songs.push(song);

            try {
                queueContruct.connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                await playSong(interaction.guild, queueContruct.songs[0], queue);
                await interaction.reply({ content: `Started playing: **${song.title}**`, embeds: [embed] });
            } catch (err) {
                console.log(err);
                queue.delete(interaction.guildId);
                return interaction.reply('There was an error connecting to the voice channel!');
            }
        } else {
            serverQueue.songs.push(song);
            return interaction.reply({ content: `${song.title} has been added to the queue!`, embeds: [embed] });
        }
    } catch (error) {
        console.error(error);
        interaction.reply('There was an error playing the song.');
    }
}

module.exports = { handleGingCommand };
