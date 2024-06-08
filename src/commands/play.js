const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const play = require('play-dl');
const playSong = require('../playSong');

async function handlePlayCommand(interaction, serverQueue, queue) {
    const songName = interaction.options.getString('song');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply('You need to be in a voice channel to play music!');
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return interaction.reply('I need the permissions to join and speak in your voice channel!');
    }

    const songInfo = await play.search(songName, { limit: 1 });
    const song = {
        title: songInfo[0].title,
        url: songInfo[0].url
    };

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
            interaction.reply(`Started playing: **${song.title}**`);
        } catch (err) {
            console.log(err);
            queue.delete(interaction.guildId);
            return interaction.reply('There was an error connecting to the voice channel!');
        }
    } else {
        serverQueue.songs.push(song);
        return interaction.reply(`${song.title} has been added to the queue!`);
    }
}

module.exports = { handlePlayCommand };
