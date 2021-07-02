//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager } = require('./../../pomodoro');

module.exports = class VolumePomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            group: 'pomodoro',
            description: 'Chages the alert volume',
            memberName: 'alert',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'volume',
                    prompt: 'What is the volume?',
                    type: 'integer',
                    default: 50
                }
            ]
        });
    }


    run(message, { volume }) {
        let pomodoro = pomodoroManager.pomodoros.filter(
            (pomodoro) => pomodoro.id == message.guild.id
        );

        if (pomodoro.length == 0) {
            message.reply("There's no pomodoro currently running!");
            return;
        }

        if (pomodoro[0].textOnly) {
            message.reply("You can't change the volume of a text-only pomodoro!");
            return;
        }

        if (!message.member.voice.channel) {
            message.reply('You are not in a voice channel!');
            return;
        }

        if (!(volume >= 1 && volume <= 100)) {
            message.channel.send('Please insert a valid number between 1 and 100');
            return;
        }

        pomodoro[0].changeVolume(volume / 100);
        return message.say(`The volume has been set to ${volume}`);
    }
}