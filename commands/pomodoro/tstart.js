//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager, Pomodoro } = require('./../../pomodoro');

module.exports = class TextStartPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tstart',
            aliases: ['comecar-texto'],
            group: 'pomodoro',
            description: '$',
            memberName: 'tstart',
            args: [
                {
                    key: 'workTime',
                    prompt: 'What is the pomodoro duration?',
                    type: 'integer',
                    default: 45
                },
                {
                    key: 'shortBreakTime',
                    prompt: 'What is the short break duration?',
                    type: 'integer',
                    default: 15
                },
                {
                    key: 'longBreakTime',
                    prompt: 'What is the long break duration?',
                    type: 'integer',
                    default: 15
                }

            ]
        })
    }

    run(message, { workTime, shortBreakTime, longBreakTime }) {
        let pomodoro = pomodoroManager.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length > 0) {
            message.reply("There's already a pomodoro running!");
            return;
        }

        //Start the pomodoro
        try {
            pomodoroManager.addPomodoro(
                new Pomodoro(
                    workTime * 60000,
                    shortBreakTime * 60000,
                    longBreakTime * 60000,
                    null,
                    message.guild.id,
                    message,
                    true
                )
            );

        } catch (err) {
            console.log(err);
        }

        return message.channel.send(
            `Text-only pomodoro started!\n`
            + `Duration: **${workTime}m**\n`
            + `Short break: **${shortBreakTime}m**\n`
            + `Long break: **${longBreakTime}m**\n`
        );
    }
}
