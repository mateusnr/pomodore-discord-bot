class Pomodoro {
    constructor(
        workTime,
        smallBreak,
        bigBreak,
        connection,
        id,
        message,
        textOnly
    ) {
        this.id = id;
        this.workTime = workTime;
        this.smallBreak = smallBreak;
        this.bigBreak = bigBreak;
        this.peopleToDm = [];
        this.textAlerts = true;
        this.volume = 0.5;
        this.connection = connection;
        this.message = message;
        this.time = 1;
        this.timerStartedTime = new Date();
        this.dispatcher = null;
        this.timer = null;
        this.alertText = '';
        this.interval = null;
        this.textOnly = textOnly;

        // if (!textOnly) {
        //   this.connection.voice.setSelfDeaf(true);
        // }

        this.startANewCycle();
    }

    startANewCycle() {
        try {
            if (this.time >= 20) {
                this.stopTimer();

                this.message.channel.send(
                    'You reached the maximum pomodoro cycles! Rest a little!'
                );

                if (!this.textOnly) {
                    this.connection.disconnect();
                }

                container.removePomodoro(this.message.guild.id);
                return;
            }

            if (this.time % 2 != 0 && this.time != 7) {
                this.interval = this.workTime;
                this.alertText = `You worked for ${
                    this.workTime / 60000
                }min! Time for a small break of ${this.smallBreak / 60000}min!`;
            } else if (this.time == 7) {
                this.interval = this.workTime;
                this.alertText = `You worked for ${
                    this.workTime / 60000
                }min! Time for a big break of ${this.bigBreak / 60000}min!`;
            } else if (this.time % 2 == 0 && this.time != 8) {
                this.interval = this.smallBreak;
                this.alertText = `You finished your ${
                    this.smallBreak / 60000
                }min break! Let's get back to work!`;
            } else if (this.time == 8) {
                this.interval = this.bigBreak;
                this.alertText = `You finished your ${
                    this.bigBreak / 60000
                }min break! Let's get back to work!`;
            }

            this.timerStartedTime = new Date();

            if (!this.textOnly) {
                this.dispatcher = this.connection.play('./sounds/time-over.ogg', {
                    volume: this.volume,
                });

                this.dispatcher.on('end', () => {
                    this.dispatcher = this.connection.play(
                        './sounds/silence-fixer.ogg'
                    );
                });
            }

            this.timer = setTimeout(() => {
                this.time++;

                //Send Text Alerts
                if (this.textAlerts) {
                    this.message.channel.send(this.alertText);
                }

                //Send DM Alerts
                if (this.peopleToDm.length > 0) {
                    this.peopleToDm.forEach((person) => {
                        try {
                            client.users.get(person).send(this.alertText);
                        } catch (err) {
                            console.log(err);
                        }
                    });
                }

                //Start a New Cycle
                this.startANewCycle();
            }, this.interval);
        } catch (err) {
            console.log(err);
        }
    }

    stopTimer() {
        clearTimeout(this.timer);
        if (!this.textOnly) {
            this.dispatcher.destroy();
        }
    }

    addToDM(id, message) {
        if (this.peopleToDm.filter((person) => person == id).length == 0) {
            this.peopleToDm.push(id);
            message.reply('you will now receive the alerts via Direct Message!');
        } else {
            this.peopleToDm = this.peopleToDm.filter((person) => person != id);
            message.reply('you will stop receiving the alerts via Direct Message!');
        }
    }

    toggleNotifications(message) {
        this.textAlerts = !this.textAlerts;

        if (this.textAlerts) {
            message.channel.send('The text notifications have been turned on!');
        } else {
            message.channel.send('The text notifications have been turned off!');
        }
    }

    changeVolume(volume) {
        this.volume = volume;
    }
}

module.exports = Pomodoro;