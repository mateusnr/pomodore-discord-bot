import type { Message } from "discord.js";
import { EnsurePomodoroRunning, PomodoroCommand } from "../utils";

export class PomodoroDMCommand extends PomodoroCommand {
    @EnsurePomodoroRunning
    public async messageRun(message: Message) {
        if (!this.pomodoro!.textOnly) {
            if (!message.member!.voice.channel) {
                message.reply('You are not in a voice channel!');
                return;
            }
        }

        this.pomodoro!.addToDM(message.author.id, message);
    }
}
