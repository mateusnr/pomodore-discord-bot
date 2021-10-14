import Pomodoro from "./pomodoro";

export default class Container {
    pomodoros: Pomodoro[];

    constructor() {
        this.pomodoros = [];
    }

    addPomodoro(pomodoro: Pomodoro) {
        this.pomodoros.push(pomodoro);
    }

    removePomodoro(id: string) {
        this.pomodoros = this.pomodoros.filter((pomodoro) => pomodoro.id != id);
    }
}