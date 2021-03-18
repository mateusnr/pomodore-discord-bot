//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager, Pomodoro } = require('./../../pomodoro')

module.exports = class StopPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['parar'],
            group: 'pomodoro',
            description: 'Stops the current pomodoro',
            memberName: 'stop'
        });
    }

    run(message) {
        let pomodoroStop = pomodoroManager.pomodoros.filter(
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
        pomodoroManager.removePomodoro(message.guild.id);

        if (!pomodoroStop[0].textOnly) {
            message.member.voice.channel.leave();
        }

        return message.channel.send('Nice work! Glad I could help!');
    }
}