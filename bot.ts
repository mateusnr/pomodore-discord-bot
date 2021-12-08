import dotenv from 'dotenv';
import { Intents } from 'discord.js';
import PomodoroContainer from './container';
import { SapphireClient } from '@sapphire/framework';

dotenv.config();

const client = new SapphireClient({
    defaultPrefix: 'pd!',
    loadDefaultErrorListeners: false,
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
    console.log('Pomodoro bot started');
    client.user!.setActivity('Type pd!help');
});

let container = PomodoroContainer.getInstance();

setInterval(() => {
    container.pomodoros.forEach((pomodoro) => {
        console.log(`Server: ${pomodoro.guild.name} (${pomodoro.guild.id}), Iteration: ${pomodoro.time} Type: ${pomodoro.textOnly ? 'text' : 'voice'}`);
    });
}, 600000);