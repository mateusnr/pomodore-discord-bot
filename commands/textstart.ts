import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
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
        const workTime = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 45, this);
        const smallBreak = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 15, this);
        const bigBreak = await handleArgs(args.pick('number', { minimum: 5, maximum: 120 }), 15, this);

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
                    smallBreak! * 60000,
                    bigBreak! * 60000,
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
