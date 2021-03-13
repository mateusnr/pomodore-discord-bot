require('dotenv').config();
const Discord = require('discord.js');
const Pomodoro = require('./pomodoro');
const Constants = require('./constants');

const client = new Discord.Client();

if (process.env.SH_TOKEN == '' || process.env.SH_TOKEN == undefined) {
    client.login(process.env.DJS_TOKEN);
} else {
    client.login(process.env.SH_TOKEN);
}

client.on('ready', () => {
    console.log('❤');
    client.user.setActivity('Type pd!help');
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


class Container {
    constructor() {
        this.pomodoros = [];
    }

    addPomodoro(pomodoro) {
        this.pomodoros.push(pomodoro);
    }

    removePomodoro(id) {
        this.pomodoros = this.pomodoros.filter((pomodoro) => pomodoro.id != id);
    }
}

let container = new Container();

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
    container.pomodoros.forEach((pomodoro) => {
        console.log(`${pomodoro.id}: ${pomodoro.time}: ${pomodoro.textOnly}`);
    });
    console.log('#############################');
}, 600000);

client.on('message', async (message) => {
    if (!message.guild) return;

    const args = message.content.trim().split(' ');

    if (args[0] === COMMANDS[1]) {
        //Check arguments
        if (!checkParams(args[1], args[2], args[3], message)) {
            return;
        }

        //Check if there's already a pomodoro running on the server
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length > 0) {
            message.reply("There's already a pomodoro running!");
            return;
        }

        //Start the pomodoro
        try {
            if (args[1] && args[2] && args[3]) {
                container.addPomodoro(
                    new Pomodoro(
                        parseInt(args[1] * 60000),
                        parseInt(args[2] * 60000),
                        parseInt(args[3] * 60000),
                        null,
                        message.guild.id,
                        message,
                        true
                    )
                );
            } else {
                container.addPomodoro(
                    new Pomodoro(
                        1500000,
                        300000,
                        900000,
                        null,
                        message.guild.id,
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

    if (args[0] === COMMANDS[0]) {
        //Check arguments
        if (!checkParams(args[1], args[2], args[3], message)) {
            return;
        }

        if (message.member.voice) {
            let pomodoro = container.pomodoros.filter(
                (pomodoro) => pomodoro.id == message.guild.id
            );

            if (pomodoro.length > 0) {
                message.reply("There's already a pomodoro running!");
                return;
            }

            try {
                if (args[1] && args[2] && args[3]) {
                    container.addPomodoro(
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
                    container.addPomodoro(
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

    //Stop the pomodoro
    if (args[0] == COMMANDS[2]) {
        let pomodoroStop = container.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoroStop.length == 0) {
            message.reply("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoroStop[0].textOnly) {
            if (!message.member.voice.channel) {
                message.reply('You are not in a voice channel!');
                return;
            }
        }

        pomodoroStop[0].stopTimer();
        container.removePomodoro(message.guild.id);

        message.channel.send('Nice work! Glad I could help!');

        if (!pomodoroStop[0].textOnly) {
            message.member.voice.channel.leave();
        }
    }

    if (args[0] == COMMANDS[3]) {
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length == 0) {
            message.reply("There's no pomodoro currently running!");
            return;
        }

        let now = new Date();
        let timePassed = now.getTime() - pomodoro[0].timerStartedTime.getTime();
        let timeLeft;

        if (pomodoro[0].time % 2 != 0) {
            timeLeft = parseInt((pomodoro[0].workTime - timePassed) / 60000);
            message.channel.send(
                `${timeLeft + 1}min left to your break! Keep it up!`
            );
        } else if (pomodoro[0].time % 2 == 0 && pomodoro[0].time != 8) {
            timeLeft = parseInt((pomodoro[0].smallBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        } else {
            timeLeft = parseInt((pomodoro[0].bigBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        }
    }

    if (args[0] == COMMANDS[7]) {
        message.author.send(Constants.HELP_MESSAGE_EMBED);
    }

    if (args[0] == COMMANDS[4]) {
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length == 0) {
            message.reply("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoro[0].textOnly) {
            if (!message.member.voice.channel) {
                message.reply('You are not in a voice channel!');
                return;
            }
        }

        pomodoro[0].addToDM(message.author.id, message);
    }

    if (args[0] == COMMANDS[5]) {
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length == 0) {
            message.reply("There's no pomodoro currently running!");
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

        if (!message.member.voice.channel) {
            message.reply('You are not in a voice channel!');
            return;
        }
    }

    if (args[0] == COMMANDS[6]) {
        let pomodoro = container.pomodoros.filter(
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

    if (args[0] == COMMANDS[8]) {
        let messagesProcessed = 0;
        let allDeleted = true;
        message.channel
            .fetchMessages({ limit: 30 })
            .then((messages) => {
                messages.forEach((message) => {
                    let messageContent = message.content.trim().split(' ');
                    if (
                        COMMANDS.includes(messageContent[0]) ||
                        message.author.id == client.user.id
                    ) {
                        message
                            .delete()
                            .then(() => {
                                messagesProcessed++;
                                if (messagesProcessed == 29) {
                                    if (!allDeleted) {
                                        message.channel.send(
                                            'There was a problem deleting some of the messages! Please check my permissions!'
                                        );
                                    }
                                }
                            })
                            .catch(() => {
                                messagesProcessed++;
                                allDeleted = false;

                                if (messagesProcessed == 29) {
                                    if (!allDeleted) {
                                        message.channel.send(
                                            'There was a problem deleting some of the messages! Please check my permissions!'
                                        );
                                    }
                                }
                            });
                    }
                });
            })
            .catch(() => {
                message.channel.send(
                    'There was a problem deleting the messages! Please check my permissions!'
                );
            });
    }
});
