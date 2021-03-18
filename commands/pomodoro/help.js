//@ts-check
const { Command } = require('discord.js-commando');
const Constants = require('./../../constants');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['ajuda'],
            group: 'pomodoro',
            description: 'Displays a help message',
            memberName: 'help' 
        });
    }

    run(message){
        return message.say(Constants.HELP_MESSAGE_EMBED);
    }
}