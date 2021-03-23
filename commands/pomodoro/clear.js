//@ts-check
const { Command } = require('discord.js-commando');
const { pomodoroManager } = require('./../../pomodoro');

module.exports = class ClearMessagesPomodoroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'pomodoro',
            description: 'Clear bot messages from the channel',
            memberName: 'clear'
        })
    }

    run(message) {
        let messagesProcessed = 0;
        let allDeleted = true;
        message.channel
            .messages.fetch({ limit: 30 })
            .then((messages) => {
                messages.forEach((msg) => {
                    let messageContent = msg.content.trim().split(' ');
                    const prefix = msg.client.commandPrefix;
                    const command = msg.content.substr(prefix.length);
                    if (
                        message.command.group.commands.has(command) || 
                        message.author.id == msg.client.user.id
                    ) {
                        msg
                            .delete()
                            .then(() => {
                                messagesProcessed++;
                                if (messagesProcessed == 29) {
                                    if (!allDeleted) {
                                        msg.channel.send(
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
                                        msg.channel.send(
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
        
        return null;
    }
}


