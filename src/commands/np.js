const createnpEmbedMessage = require("../npEmbedMessage");

async function handleNowPlayingCommand(interaction, serverQueue) {
    if (!serverQueue || !serverQueue.songs.length) {
        return interaction.reply({ content: 'There is no song currently playing.', ephemeral: false });
    }

    const nowPlaying = serverQueue.songs[0];
    const embed = createnpEmbedMessage(nowPlaying, serverQueue);

    return interaction.reply({ embeds: [embed] });
}

module.exports = { handleNowPlayingCommand };
