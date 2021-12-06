import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";

@ApplyOptions<CommandOptions>({
    name: "stop",
    description: "Stops a pomodoro"
})
export class PomodoroStopCommand extends Command {
    public async messageRun(message: Message) {
        const instance = PomodoroContainer.getInstance();

        let pomodoroStop = instance.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoroStop.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        if (!pomodoroStop[0].textOnly) {
            if (!message.member!.voice.channel) {
                message.channel.send('You are not in a voice channel!');
                return;
            }
        }

        pomodoroStop[0].stopTimer();
        instance.removePomodoro(message.guild!.id);

        message.channel.send('Nice work! Glad I could help!');

        if (!pomodoroStop[0].textOnly) {
            pomodoroStop[0].connection!.destroy();
        }
    }
}