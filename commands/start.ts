import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { sendLocalized } from "@sapphire/plugin-i18next";
import type { Message } from "discord.js";
import PomodoroContainer from "../container";
import Pomodoro from "../pomodoro";
import { EnsureNoPomodoroRunning, handleArgs } from "../utils";

@ApplyOptions<CommandOptions>({
    name: 'start',
    description: 'Starts a pomodoro',
	aliases: ['s']
})
export class PomodoroStartCommand extends Command {
    @EnsureNoPomodoroRunning
    public async messageRun(message: Message, args: Args) {
        const container = PomodoroContainer.getInstance();

        const workTime = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 45);
        const shortBreak = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 15);
        const longBreak = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 15);
        /*const workTime = args.finished ? 45 : await args.pick('number', { minimum: 5, maximum: 120 });
        const shortBreak = args.finished ? 15 : await args.pick('number', { minimum: 5, maximum: 120 });
        const longBreak = args.finished ? 15 : await args.pick('number', { minimum: 5, maximum: 120 });*/

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

        await sendLocalized(message, 'start:started');
    }
}
