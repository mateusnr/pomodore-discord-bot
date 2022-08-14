import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions, UserError } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";
import Pomodoro from "../pomodoro";
import { handleArgs } from "../utils";

@ApplyOptions<CommandOptions>({
    name: 'textstart',
    description: 'Starts a text-only pomodoro',
    aliases: ['tostart']
})
export class PomodoroTextStartCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const container = PomodoroContainer.getInstance();

        let workTime: number, shortBreak: number, longBreak: number;
        let areArgsOk = true;
        try {
            workTime = args.finished ? 45 : await args.pick('number', { minimum: 5, maximum: 120 });
            shortBreak = args.finished ? 15 : await args.pick('number', { minimum: 5, maximum: 120 });
            longBreak = args.finished ? 15 : await args.pick('number', { minimum: 5, maximum: 120 });
        } catch (err) {
            areArgsOk = false;
        }

        if (!areArgsOk) {
            throw new UserError({ identifier: 'OutOfBoundsInterval', message: 'Please insert a number between 5 and 120' });
        }
        let pomodoro = container.pomodoros.filter(
            (pomodoro) => pomodoro.guild.id == message.guild!.id
        );

        if (pomodoro.length > 0) {
            message.channel.send("There's already a pomodoro running!");
            return;
        }

        //Start the pomodoro
        try {
            container.addPomodoro(
                new Pomodoro(
                    this.container.client,
                    workTime! * 60000,
                    shortBreak! * 60000,
                    longBreak! * 60000,
                    message.guild!,
                    message,
                    true
                )
            );
        } catch (err) {
            console.log(err);
            message.channel.send(
                "I'm struggling to join your voice channel! Please check my permissions!"
            );
            return;
        }

        message.channel.send("Pomodoro started! Let's get to work!");
    }
}
