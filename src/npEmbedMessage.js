const { EmbedBuilder } = require('discord.js');

function createnpEmbedMessage(song, serverQueue) {

    const updatedQueue = serverQueue ? serverQueue.songs : [song];

    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Here\'s Whats Playing!')
        .addFields(
            { name: 'Song Name:', value: song.title },
            { name: 'Requested by:', value: song.requestedBy },
            { name: 'URL:', value: song.url },
            { name: 'Current Queue:', value: updatedQueue.map((song, index) => `${index + 1}. ${song.title}`).join('\n') }
        )
        .setThumbnail(song.thumbnail)
        .setTimestamp();
    return embed;
}

module.exports = createnpEmbedMessage;
