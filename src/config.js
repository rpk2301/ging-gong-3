const { GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
];

const token = 'MTI0ODA0OTc0OTI3NDEzNjYzNw.GcdlkO.v6G5JvT0Hr2t31pNY5djV4Z8wkKC0e6WNrWtF4'
module.exports = { intents, token };
