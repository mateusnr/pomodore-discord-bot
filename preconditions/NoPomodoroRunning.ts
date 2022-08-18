import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import PomodoroContainer from '../container';

export class NoPomodoroRunningPrecondition extends Precondition {
    public override messageRun(message: Message) {
        const pomodoro = PomodoroContainer.getInstance().findPomodoro(message.guild!.id);
        if (pomodoro) {
            return this.error({message: `There's already a pomodoro running`});
        }
        return this.ok();
    }
}

declare module '@sapphire/framework' {
    interface Preconditions { 
        NoPomodoroRunning: never;
    }
}
