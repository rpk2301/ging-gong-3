async function handleSkipCommand(interaction, serverQueue) {
    if (!interaction.member.voice.channel) {
        return interaction.reply('You have to be in a voice channel to skip the music!');
    }
    if (!serverQueue) {
        return interaction.reply('There is no song that I could skip!');
    }
    serverQueue.player.stop();
    interaction.reply('Skipped the current song!');
}

module.exports = { handleSkipCommand };
