import { Command } from "@sapphire/framework";
import type {Message} from "discord.js";
import PomodoroContainer from "../container";

export class PomodoroToggleTextCommand extends Command {
    public async messageRun(message: Message) {
		let instance = PomodoroContainer.getInstance();
		let pomodoro = instance.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
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

        if (!message.member!.voice.channel) {
            message.channel.send('You are not in a voice channel!');
            return;
        }
    }
}
