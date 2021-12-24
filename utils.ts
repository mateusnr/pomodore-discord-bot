import { Command, ArgType, UserError } from "@sapphire/framework";
import type { Message } from "discord.js";
import PomodoroContainer from "./container";
import Pomodoro from "./pomodoro";

export async function handleArgs<T extends ArgType[keyof ArgType]>(argPicker: Promise<T>, defaultValue: number, ctx: Command) {
    return argPicker.catch((error) => {
        if (error.identifier === 'numberTooLarge' || error.identifier === 'numberTooSmall') {
            throw new UserError({ identifier: 'OutOfBoundsInterval', message: 'Please insert a number between 5 and 120', context: ctx.toJSON() });
        } else if (error.identifier === 'argsMissing') {
            return defaultValue;
        }
    });
}

export const EnsureNoPomodoroRunning = (_target: Object, _key: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: (...args: any[]) => any, message: Message, ...args: any[]) {
        const pomodoro = PomodoroContainer.getInstance().findPomodoro(message.guild!.id);
        if (pomodoro) {
            throw new UserError({
                identifier: 'PomodoroAlreadyRunning',
                message: `There's already a pomodoro running!`
            })
        }
        originalMethod.call(this, message, ...args);
    };
}

export const EnsurePomodoroRunning = (_target: Object, _key: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: any, message: Message, ...args: any[]) {
        const pomodoro = PomodoroContainer.getInstance().findPomodoro(message.guild!.id);
        if (!pomodoro) {
            throw new UserError({
                identifier: 'PomodoroNotFound',
                message: `There's no pomodoro currently running`
            })
        }
        this.pomodoro = pomodoro;
        originalMethod.call(this, message, ...args);
    };
}

export abstract class PomodoroCommand extends Command {
    pomodoro?: Pomodoro;
}