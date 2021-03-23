//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager } = require('./../../pomodoro');

module.exports = class StatusPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            group: 'pomodoro',
            description: `Check pomodoro's current status`,
            memberName: 'status'
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

        let now = new Date();
        let timePassed = now.getTime() - pomodoro[0].timerStartedTime.getTime();
        let timeLeft;

        if (pomodoro[0].time % 2 != 0) {
            timeLeft = Math.floor((pomodoro[0].workTime - timePassed) / 60000);
            message.channel.send(
                `${timeLeft + 1}min left to your break! Keep it up!`
            );
        } else if (pomodoro[0].time % 2 == 0 && pomodoro[0].time != 8) {
            timeLeft = Math.floor((pomodoro[0].smallBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        } else {
            timeLeft = Math.floor((pomodoro[0].bigBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        }

        return null;
    }
}