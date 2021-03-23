//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager } = require('./../../pomodoro');

module.exports = class ToggleTextPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'togtext',
            aliases: ['toggletext'],
            group: 'pomodoro',
            description: 'Toggle text channel notifications',
            memberName: 'togtext'
        })
    }

    run(message) {
        let pomodoro = pomodoroManager.pomodoros.filter(
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

        return null;
    }
}