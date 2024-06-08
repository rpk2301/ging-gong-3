const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { intents, token } = require('./config');
const { handlePlayCommand } = require('./commands/play');
const { handleSkipCommand } = require('./commands/skip');
const { handleStopCommand } = require('./commands/stop');
const { handleQueueCommand } = require('./commands/q');
const { handleGingCommand } = require('./commands/ging');
const { handleGongCommand } = require('./commands/gong');
const { handleNowPlayingCommand } = require('./commands/np');
const playSong = require('./playSong');
const createEmbedMessage = require('./createEmbedMessage');
const {createAudioPlayer, joinVoiceChannel} = require('@discordjs/voice')
const queue = new Map();
const logger = require('./logger');

const client = new Client({ intents });

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isCommand()) {
            const { commandName } = interaction;
            const serverQueue = queue.get(interaction.guildId);

            logger.info('Command %s received in guild: %s', commandName, interaction.guildId);

            if (commandName === 'play') {
                await handlePlayCommand(interaction, serverQueue, queue);
            } else if (commandName === 'skip') {
                await handleSkipCommand(interaction, serverQueue);
            } else if (commandName === 'stop') {
                await handleStopCommand(interaction, serverQueue);
            } else if (commandName === 'q') {
                await handleQueueCommand(interaction, serverQueue);
            } else if (commandName === 'ging') {
                await handleGingCommand(interaction, serverQueue, queue);
            } else if (commandName === 'gong') {
                await handleGongCommand(interaction, serverQueue, queue);
            } else if (commandName === 'np') {
                await handleNowPlayingCommand(interaction, serverQueue);
            }
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId === 'select') {
                const { videoId, thumbnail } = JSON.parse(interaction.values[0]);
                const serverQueue = queue.get(interaction.guildId);

                const selectedOption = interaction.message.components[0].components[0].options.find(opt => JSON.parse(opt.value).videoId === videoId);
                const requestedBy = interaction.member.nickname || interaction.user.username;
                const song = {
                    title: selectedOption.label,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnail: thumbnail,
                    requestedBy: requestedBy
                };

                logger.info('Song selected: %s in guild: %s', song.title, interaction.guildId);

                if (!serverQueue) {
                    const queueContruct = {
                        textChannel: interaction.channel,
                        voiceChannel: interaction.member.voice.channel,
                        connection: null,
                        songs: [],
                        player: createAudioPlayer(),
                    };

                    queue.set(interaction.guildId, queueContruct);
                    queueContruct.songs.push(song);

                    try {
                        queueContruct.connection = joinVoiceChannel({
                            channelId: interaction.member.voice.channel.id,
                            guildId: interaction.guildId,
                            adapterCreator: interaction.guild.voiceAdapterCreator,
                        });
                        await playSong(interaction.guild, queueContruct.songs[0], queue);
                        const embed = createEmbedMessage(song, queueContruct);
                        await interaction.update({ content: `Started playing: **${song.title}**`, embeds: [embed], components: [] });
                        logger.info('Started playing song: %s in guild: %s', song.title, interaction.guildId);
                    } catch (err) {
                        logger.error('Error connecting to voice channel in guild: %s', interaction.guildId, err);
                        queue.delete(interaction.guildId);
                        await interaction.update({ content: 'There was an error connecting to the voice channel!', components: [] });
                    }
                } else {
                    serverQueue.songs.push(song);
                    const embed = createEmbedMessage(song, serverQueue);
                    await interaction.update({ content: `${song.title} has been added to the queue!`, embeds: [embed], components: [] });
                    logger.info('Added song to queue: %s in guild: %s', song.title, interaction.guildId);
                }
            }
        }
    } catch (error) {
        logger.error('Error handling interaction in guild: %s', interaction.guildId, error);
        if (!interaction.replied) {
            await interaction.reply({ content: 'There was an error handling your request.', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'There was an error handling your request.', ephemeral: true });
        }
    }
});

client.login(token);
