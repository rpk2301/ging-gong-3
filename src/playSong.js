const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const fs = require('fs');

async function playSong(guild, song, queue) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        log('The queue is empty');
        await serverQueue.textChannel.send('The Queue Is Now Empty');
        guild.client.user.setPresence({
            status: 'idle',
            activities: [{
                name: 'Nothing',
                type: 'LISTENING',
            }]
        });
        return;
    }

    try {
        log(`Attempting to play song: ${song.title}`);

        const stream = await play.stream(song.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        serverQueue.player.play(resource);
        serverQueue.connection.subscribe(serverQueue.player);

        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
            log(`Finished playing: ${song.title}`);
            serverQueue.songs.shift();
            playSong(guild, serverQueue.songs[0], queue);
        });

        await serverQueue.textChannel.send(`Started playing: **${song.title}**`);
        log(`Started playing: ${song.title}`);

        // Update bot's status
        const nowPlaying = song.title;
        const formattedDuration = new Date(stream.stream.time * 1000).toISOString().substr(11, 8);
        const queueLength = serverQueue.songs.length;

        try {
            guild.client.user.setPresence({
                status: 'dnd',
                activities: [{
                    name: 'Queue',
                    type: 'LISTENING',
                    state: `🎵 Now Playing: ${nowPlaying}\n⏱️ Listening Duration: ${formattedDuration}\n🎵 Queue Length: ${queueLength}`,
                }]
            });
            log(`Updated bot's status: Now Playing - ${nowPlaying}`);
        } catch (error) {
            log('Failed Setting Presence', error);
        }
    } catch (error) {
        log('Error playing song', error);
        try {
            await serverQueue.textChannel.send(`Error playing song: **${song ? song.title : 'Unknown'}**`);
        } catch (err) {
            log('Error sending error message', err);
        }
        serverQueue.songs.shift();
        playSong(guild, serverQueue.songs[0], queue);
    }
}

function log(message, error) {
    const timestamp = new Date().toISOString();
    const logMessage = error ? `[${timestamp}] ${message} - ${error.message}\n` : `[${timestamp}] ${message}\n`;
    fs.appendFile('bot.log', logMessage, err => {
        if (err) console.error('Failed to write to log file', err);
    });
    console.log(logMessage);
}

module.exports = playSong;
