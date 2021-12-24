import Pomodoro from "./pomodoro";

export default class PomodoroContainer {
    private static instance: PomodoroContainer;

    pomodoros: Pomodoro[];

    public static getInstance() {
        if (!PomodoroContainer.instance) {
            PomodoroContainer.instance = new PomodoroContainer();
        }

        return PomodoroContainer.instance;
    }

    private constructor() {
        this.pomodoros = [];
    }

    addPomodoro(pomodoro: Pomodoro) {
        this.pomodoros.push(pomodoro);
    }

    removePomodoro(id: string) {
        this.pomodoros = this.pomodoros.filter((pomodoro) => pomodoro.guild.id != id);
    }

    findPomodoro(guildId: string) {
        return this.pomodoros.find(p => p.guild.id == guildId);
    }
}