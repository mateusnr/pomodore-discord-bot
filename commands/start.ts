import { Args, Command, UserError } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";
import Pomodoro from "../pomodoro";

export class PomodoroStartCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'start',
            description: 'Starts a pomodoro',
            aliases: ['s'],
            preconditions: ['NoPomodoroRunning']
        });
    }

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

        if (message.member?.voice.channel) {
            try {
                container.addPomodoro(
                    new Pomodoro(
                        this.container.client,
                        workTime! * 60000,
                        shortBreak! * 60000,
                        longBreak! * 60000,
                        message.guild!,
                        message,
                        false
                    )
                );
            } catch (err) {
                console.log(err);
                message.channel.send(
                    "I'm struggling to join your voice channel! Please check my permissions!"
                );
                return;
            }
        } else {
            message.channel.send(
                'You have to be in a voice channel to start a pomodoro!'
            );
            return;
        }

        await message.channel.send(await resolveKey(message, 'start:started'));
    }
}
