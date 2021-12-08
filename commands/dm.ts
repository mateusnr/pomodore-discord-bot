import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";

export class PomodoroDMCommand extends Command {
    public async messageRun(message: Message) {
		const instance = PomodoroContainer.getInstance();

		let pomodoro = instance.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoro[0].textOnly) {
            if (!message.member!.voice.channel) {
                message.channel.send('You are not in a voice channel!');
                return;
            }
        }

        pomodoro[0].addToDM(message.author.id, message);
    }
}
