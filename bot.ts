import dotenv from 'dotenv';
import { Intents } from 'discord.js';
import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register';

dotenv.config();

const client = new SapphireClient({
    defaultPrefix: 'pd!',
    loadDefaultErrorListeners: false,
    typing: true,
    i18n: {
        fetchLanguage: _ => 'en-US'
    },
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.DIRECT_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES]
});

if (process.env.SH_TOKEN == '' || process.env.SH_TOKEN == undefined) {
    client.login(process.env.DJS_TOKEN);
} else {
    client.login(process.env.SH_TOKEN);
}

client.on('ready', () => {
	client.logger.info('Bot started');
    client.user!.setActivity('Type pd!help');
});
