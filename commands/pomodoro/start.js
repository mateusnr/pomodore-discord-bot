//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager, Pomodoro } = require('./../../pomodoro');

module.exports = class StartPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'start',
            aliases: ['comecar'],
            group: 'pomodoro',
            description: 'Start pomodoro',
            memberName: 'start',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'workTime',
                    prompt: 'What is the pomodoro duration?',
                    type: 'integer',
                    default: 45,
                    min: 5,
                    max: 120
                },
                {
                    key: 'shortBreakTime',
                    prompt: 'What is the short break duration?',
                    type: 'integer',
                    default: 15,
                    min: 5,
                    max: 120
                },
                {
                    key: 'longBreakTime',
                    prompt: 'What is the long break duration?',
                    type: 'integer',
                    default: 15,
                    min: 5,
                    max: 120
                }
            ]
        })
    }

    async run(message, { workTime, shortBreakTime, longBreakTime }) {
        if (message.member.voice.channel) {
            let pomodoro = pomodoroManager.pomodoros.filter(
                (pomodoro) => pomodoro.id == message.guild.id
            );

            if (pomodoro.length > 0) {
                message.reply("There's already a pomodoro running!");
                return;
            }

            try {
                pomodoroManager.addPomodoro(
                    new Pomodoro(
                        workTime * 60000,
                        shortBreakTime * 60000,
                        longBreakTime * 60000,
                        await message.member.voice.channel.join(),
                        message.guild.id,
                        message,
                        false
                    ));
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

        return message.channel.send("Pomodoro started! Let's get to work!");
    }
}