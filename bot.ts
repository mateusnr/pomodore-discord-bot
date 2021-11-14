import dotenv from 'dotenv';
import Discord, { Intents } from 'discord.js';
import Pomodoro from './pomodoro';
import { HELP_MESSAGE_EMBED } from './constants';
import PomodoroContainer from './container';
import { SapphireClient } from '@sapphire/framework';

dotenv.config();
const client = new SapphireClient({
    defaultPrefix: '?',
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

const COMMANDS = [
    'pd!start',
    'pd!tostart',
    'pd!stop',
    'pd!status',
    'pd!dm',
    'pd!togtext',
    'pd!help',
];

let container = PomodoroContainer.getInstance();

function checkParams(arg1: string, arg2: string, arg3: string, message: Discord.Message) {
    let checked = true;

    if (arg1) {
        if (parseInt(arg1) < 5 || parseInt(arg1) > 120 || isNaN(parseInt(arg1))) {
            message.channel.send('Insert a valid time between 5 and 120 minutes!');
            checked = false;
        }
    }

    if (arg2) {
        if (parseInt(arg2) < 5 || parseInt(arg2) > 120 || isNaN(parseInt(arg2))) {
            message.channel.send('Insert a valid time between 5 and 120 minutes!');
            checked = false;
        }
    }

    if (arg3) {
        if (parseInt(arg3) < 5 || parseInt(arg3) > 120 || isNaN(parseInt(arg3))) {
            message.channel.send('Insert a valid time between 5 and 120 minutes!');
            checked = false;
        }
    }

    return checked;
}

setInterval(() => {
    container.pomodoros.forEach((pomodoro) => {
        console.log(`Server: ${pomodoro.guild.name} (${pomodoro.guild.id}), Iteration: ${pomodoro.time} Type: ${pomodoro.textOnly ? 'text' : 'voice'}`);
    });
}, 600000);

client.on('messageCreate', async (message) => {
    if (!message.guild) return;

    const args = message.content.trim().split(' ');

    if (args[0] === COMMANDS[1]) {
        //Check arguments
        if (!checkParams(args[1], args[2], args[3], message)) {
            return;
        }

        //Check if there's already a pomodoro running on the server
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length > 0) {
            message.channel.send("There's already a pomodoro running!");
            return;
        }

        //Start the pomodoro
        try {
            if (args[1] && args[2] && args[3]) {
                container.addPomodoro(
                    new Pomodoro(
                        client,
                        parseInt(args[1]) * 60000,
                        parseInt(args[2]) * 60000,
                        parseInt(args[3]) * 60000,
                        message.guild,
                        message,
                        true
                    )
                );
            } else {
                container.addPomodoro(
                    new Pomodoro(
                        client,
                        1500000,
                        300000,
                        900000,
                        message.guild,
                        message,
                        true
                    )
                );
            }
        } catch (err) {
            console.log(err);
            message.channel.send(
                "I'm struggling to join your voice channel! Please check my permissions!"
            );
            return;
        }

        message.channel.send("Pomodoro started! Let's get to work!");
    }

    else if (args[0] === COMMANDS[0]) {
        //Check arguments
        if (!checkParams(args[1], args[2], args[3], message)) {
            return;
        }

        if (message.member?.voice.channel) {
            let pomodoro = container.pomodoros.filter(
                (pomodoro) => pomodoro.guild.id == message.guild!.id
            );

            if (pomodoro.length > 0) {
                message.channel.send("There's already a pomodoro running!");
                return;
            }

            try {
                if (args[1] && args[2] && args[3]) {
                    container.addPomodoro(
                        new Pomodoro(
                            client,
                            parseInt(args[1]) * 60000,
                            parseInt(args[2]) * 60000,
                            parseInt(args[3]) * 60000,
                            message.guild,
                            message,
                            false
                        )
                    );
                } else {
                    container.addPomodoro(
                        new Pomodoro(
                            client,
                            1500000,
                            300000,
                            900000,
                            message.guild,
                            message,
                            false
                        )
                    );
                }
            } catch (err) {
                console.log(err);
                message.channel.send(
                    "I'm struggling to join your voice channel! Please check my permissions!"
                );
                return;
            }
        } else {
            message.channel.send(
                'You have to be in a voice channel to start a pomodoro!'
            );
            return;
        }
        message.channel.send("Pomodoro started! Let's get to work!");
    }

    //Stop the pomodoro
    else if (args[0] == COMMANDS[2]) {
        let pomodoroStop = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoroStop.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoroStop[0].textOnly) {
            if (!message.member!.voice.channel) {
                message.channel.send('You are not in a voice channel!');
                return;
            }
        }

        pomodoroStop[0].stopTimer();
        container.removePomodoro(message.guild.id);

        message.channel.send('Nice work! Glad I could help!');

        if (!pomodoroStop[0].textOnly) {
            pomodoroStop[0].connection!.destroy();
        }
    }
    else if (args[0] == COMMANDS[4]) {
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoro[0].textOnly) {
            if (!message.member!.voice.channel) {
                message.channel.send('You are not in a voice channel!');
                return;
            }
        }

        pomodoro[0].addToDM(message.author.id, message);
    }

    else if (args[0] == COMMANDS[5]) {
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoro[0].textOnly) {
            pomodoro[0].toggleNotifications(message);
        } else {
            message.channel.send(
                "You can't disable text messages in a text-only pomodoro!"
            );
            return;
        }

        if (!message.member!.voice.channel) {
            message.channel.send('You are not in a voice channel!');
            return;
        }
    }
});
