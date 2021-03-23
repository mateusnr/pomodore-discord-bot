//@ts-check
require('dotenv').config();
const Discord = require('discord.js');
const { pomodoroManager, Pomodoro } = require('./pomodoro');
const Constants = require('./constants');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');

const client = new CommandoClient({
    commandPrefix: '?',
    owner: '233342139889614848'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['pomodoro', 'Pomodoro commands']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

if (process.env.SH_TOKEN == '' || process.env.SH_TOKEN == undefined) {
    client.login(process.env.DJS_TOKEN);
} else {
    client.login(process.env.SH_TOKEN);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}. ID: ${client.user.id}`);
    client.user.setActivity('Use pd!help');
});

const COMMANDS = [
    'pd!start',
    'pd!tostart',
    'pd!stop',
    'pd!status',
    'pd!dm',
    'pd!togtext',
    'pd!volume',
    'pd!help',
    'pd!clear',
];

function checkParams(arg1, arg2, arg3, message) {
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
    pomodoroManager.pomodoros.forEach((pomodoro) => {
        console.log(`${pomodoro.id}: ${pomodoro.time}: ${pomodoro.textOnly}`);
    });
    console.log('#############################');
}, 600000);

client.on('message', async (message) => {
    if (!message.guild) return;

    const args = message.content.trim().split(' ');

    if (args[0] === COMMANDS[0]) {
        //Check arguments
        if (!checkParams(args[1], args[2], args[3], message)) {
            return;
        }

        if (message.member.voice.channel) {
            let pomodoro = pomodoroManager.pomodoros.filter(
                (pomodoro) => pomodoro.id == message.guild.id
            );

            if (pomodoro.length > 0) {
                message.reply("There's already a pomodoro running!");
                return;
            }

            try {
                if (args[1] && args[2] && args[3]) {
                    pomodoroManager.addPomodoro(
                        new Pomodoro(
                            parseInt(args[1] * 60000),
                            parseInt(args[2] * 60000),
                            parseInt(args[3] * 60000),
                            await message.member.voice.channel.join(),
                            message.guild.id,
                            message,
                            false
                        )
                    );
                } else {
                    pomodoroManager.addPomodoro(
                        new Pomodoro(
                            1500000,
                            300000,
                            900000,
                            await message.member.voice.channel.join(),
                            message.guild.id,
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

    // volume 
    if (args[0] == COMMANDS[6]) {
        let pomodoro = pomodoroManager.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro[0].textOnly) {
            message.reply("You can't change the volume of a text-only pomodoro!");
            return;
        }

        if (pomodoro.length == 0) {
            message.reply("There's no pomodoro currently running!");
            return;
        }

        if (!message.member.voice.channel) {
            message.reply('You are not in a voice channel!');
            return;
        }

        if (args[1]) {
            if (
                parseInt(args[1]) < 1 ||
                parseInt(args[1] > 100 || isNaN(parseInt(args[1])))
            ) {
                message.channel.send('Please insert a valid number between 0 and 100');
            } else {
                pomodoro[0].changeVolume(args[1] / 100);
                message.channel.send(`The volume has been set to ${args[1]}`);
            }
        } else {
            message.channel.send(
                'Please type a second argument with a number between 0 and 100'
            );
        }
    }

});
