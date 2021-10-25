import Pomodoro from "./pomodoro";

export default class PomodoroContainer {
    pomodoros: Pomodoro[];

    constructor() {
        this.pomodoros = [];
    }

    addPomodoro(pomodoro: Pomodoro) {
        this.pomodoros.push(pomodoro);
    }

    removePomodoro(id: string) {
        this.pomodoros = this.pomodoros.filter((pomodoro) => pomodoro.guild.id != id);
    }
}