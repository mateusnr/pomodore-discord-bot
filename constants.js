const Discord = require('discord.js');

const HELP_MESSAGE_EMBED = new Discord.MessageEmbed()
    .setColor('#f00')
    .setTitle('Pomodore commands')
    .setDescription('Here is the list of commands to use the bot!')
    .addFields(
        [
            {
                name: 'Start the pomodoro with default values (25, 5, 15)',
                value: 'pd!start',
                inline: true
            },
            {
                name: 'Start a text-only pomodoro with default values',
                value: 'pd!tostart',
                inline: true
            },
            {
                name: 'Start the pomodoro with specific values',
                value: 'pd!start [work time] [small break time] [big break time]',
                inline: true
            },
            {
                name: 'Start a text-only pomodoro with specific values',
                value: 'pd!tostart [work time] [small break time] [big break time]',
                inline: true
            },
            {
                name: 'Stop the pomodoro',
                value: 'pd!stop',
                inline: true
            },
            {
                name: 'Check the current status of the pomodoro',
                value: 'pd!status',
                inline: true
            },
            {
                name: 'Toggle the notifications via direct message',
                value: 'pd!dm',
                inline: true
            },
            {
                name: 'Toggle the channel text notifications',
                value: 'pd!togtext',
                inline: true
            },
            {
                name: 'Change the volume of the alerts, defaults to 50',
                value: 'pd!volume volume',
                inline: true
            },
            {
                name: 'Get the list of commands',
                value: 'pd!help',
                inline: true
            }
        ]);

exports.HELP_MESSAGE_EMBED = HELP_MESSAGE_EMBED;