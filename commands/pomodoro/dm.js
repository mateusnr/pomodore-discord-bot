//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager } = require('./../../pomodoro');

module.exports = class DMPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            aliases: ['pm'],
            group: 'pomodoro',
            description: 'Toggle direct message notifications',
            memberName: 'dm'
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
            if (!message.member.voice.channel) {
                message.reply('You are not in a voice channel!');
                return;
            }
        }

        pomodoro[0].addToDM(message.author.id, message);

        return null;
    }
}