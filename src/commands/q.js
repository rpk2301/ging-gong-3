async function handleQueueCommand(interaction, serverQueue) {
    if (!serverQueue || !serverQueue.songs.length) {
        return interaction.reply('The queue is empty.');
    }

    const songList = serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
    return interaction.reply(`Current queue:\n${songList}`);
}

module.exports = { handleQueueCommand };