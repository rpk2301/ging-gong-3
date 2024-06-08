async function handleStopCommand(interaction, serverQueue) {
    if (!interaction.member.voice.channel) {
        return interaction.reply('You have to be in a voice channel to stop the music!');
    }
    if (!serverQueue) {
        return interaction.reply('There is no song that I could stop!');
    }
    serverQueue.songs = [];
    serverQueue.player.stop();
    interaction.reply('Stopped the music and cleared the queue!');
}

module.exports = { handleStopCommand };
