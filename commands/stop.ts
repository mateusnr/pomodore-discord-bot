import { ApplyOptions } from "@sapphire/decorators";
import { CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";
import { EnsurePomodoroRunning, PomodoroCommand } from "../utils";

@ApplyOptions<CommandOptions>({
    name: "stop",
    description: "Stops a pomodoro"
})
export class PomodoroStopCommand extends PomodoroCommand {
    @EnsurePomodoroRunning
    public async messageRun(message: Message) {
        const instance = PomodoroContainer.getInstance();

        if (!this.pomodoro!.textOnly) {
            if (!message.member!.voice.channel) {
                message.channel.send('You are not in a voice channel!');
                return;
            }
        }

        this.pomodoro!.stopTimer();

        instance.removePomodoro(message.guild!.id);

        message.channel.send('Nice work! Glad I could help!');

        if (!this.pomodoro!.textOnly) {
            this.pomodoro!.connection!.destroy();
        }
    }
}