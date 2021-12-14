import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";

@ApplyOptions<CommandOptions>({
    name: 'status',
    description: `Check a pomodoro's current status`
})
export class PomodoroStatusCommand extends Command {
    public async messageRun(message: Message) {
        const container = PomodoroContainer.getInstance();
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length == 0) {
            message.channel.send("There's no pomodoro currently running!");
            return;
        }

        let now = new Date();
        let timePassed = now.getTime() - pomodoro[0].timerStartedTime.getTime();
        let timeLeft;

        if (pomodoro[0].currentIteration % 2 != 0) {
            timeLeft = Math.floor((pomodoro[0].workTime - timePassed) / 60000);
            message.channel.send(
                `${timeLeft + 1}min left to your break! Keep it up!`
            );
        } else if (pomodoro[0].currentIteration % 2 == 0 && pomodoro[0].currentIteration != 8) {
            timeLeft = Math.floor((pomodoro[0].shortBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        } else {
            timeLeft = Math.floor((pomodoro[0].longBreak - timePassed) / 60000);
            message.channel.send(`${timeLeft + 1}min left to start working!`);
        }
    }
}