import { ApplyOptions } from "@sapphire/decorators";
import { CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";
import { EnsurePomodoroRunning, PomodoroCommand } from "../utils";

@ApplyOptions<CommandOptions>({
    name: 'status',
    description: `Check a this.pomodoro!'s current status`,
	aliases: ['st']
})
export class PomodoroStatusCommand extends PomodoroCommand {
    @EnsurePomodoroRunning
    public async messageRun(message: Message) {
        let now = new Date();
        let timePassed = now.getTime() - this.pomodoro!.timerStartedTime.getTime();
        let timeLeft;

        if (this.pomodoro!.currentIteration % 2 != 0) {
            timeLeft = Math.floor((this.pomodoro!.workTime - timePassed) / 60000);
            message.channel.send(
                `${timeLeft + 1}min left to your break! Keep it up!`
            );
        } else if (this.pomodoro!.currentIteration % 2 == 0 && this.pomodoro!.currentIteration != 8) {
            timeLeft = Math.floor((this.pomodoro!.shortBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        } else {
            timeLeft = Math.floor((this.pomodoro!.longBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        }
    }
}
