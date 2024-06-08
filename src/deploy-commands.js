const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song to play')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),
    new SlashCommandBuilder()
        .setName('q')
        .setDescription('Show the current song queue'),
    new SlashCommandBuilder()
        .setName('ging')
        .setDescription('Play a song from a YouTube URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL of the song to play')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('gong')
        .setDescription('Search for a song on YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The search query')
                .setRequired(true)),
    new SlashCommandBuilder().setName('np').setDescription('Show the currently playing song')

].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken('MTI0ODA0OTc0OTI3NDEzNjYzNw.GcdlkO.v6G5JvT0Hr2t31pNY5djV4Z8wkKC0e6WNrWtF4');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands('1248049749274136637'),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
