import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnection } from "@discordjs/voice";
import Discord from "discord.js";

export default class Pomodoro {
    client: Discord.Client;

    workTime: number;
    shortBreak: number;
    longBreak: number;
    currentInterval?: number;
    currentIteration: number;
    textOnly: boolean;

    connection?: VoiceConnection;
    guild: Discord.Guild;
    message: Discord.Message;

    textAlerts: boolean = true;
    volume: number = 0.5;

    peopleToDm: string[];

    timerStartedTime: Date; 
    alertText: string = ''; 

    timer?: NodeJS.Timeout;
    player?: AudioPlayer;

    constructor(
        client: Discord.Client,
        workTime: number,
        shortBreak: number,
        longBreak: number,
        guild: Discord.Guild,
        message: Discord.Message,
        textOnly: boolean
    ) {
        this.client = client;
        this.guild = guild;
        this.workTime = workTime;
        this.shortBreak = shortBreak;
        this.longBreak = longBreak;
        this.peopleToDm = [];
        this.message = message;
        this.currentIteration = 1;
        this.timerStartedTime = new Date();
        this.textOnly = textOnly;

        if (!this.textOnly) {
            const channel = this.message.member!.voice.channel;
            if (channel != null && channel.type === "GUILD_VOICE") {
                this.connection = this.enterVoiceChannel(channel);
            }
            this.player = createAudioPlayer();
            this.connection?.subscribe(this.player!);
        }

        this.startANewCycle();
		this.client.logger.info(`Started pomodoro on server (${this.guild.id}, ${this.guild.name})`);
    }

    enterVoiceChannel(voiceChannel: Discord.VoiceChannel) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        return connection;
    }

    startANewCycle() {
        try {
            if (this.currentIteration % 2 != 0 && this.currentIteration != 7) {
                this.currentInterval = this.workTime;
                this.alertText = `You worked for ${
                    this.workTime / 60000
                }min! Time for a small break of ${this.shortBreak / 60000}min!`;
            } else if (this.currentIteration == 7) {
                this.currentInterval = this.workTime;
                this.alertText = `You worked for ${
                    this.workTime / 60000
                }min! Time for a big break of ${this.longBreak / 60000}min!`;
            } else if (this.currentIteration % 2 == 0 && this.currentIteration != 8) {
                this.currentInterval = this.shortBreak;
                this.alertText = `You finished your ${
                    this.shortBreak / 60000
                }min break! Let's get back to work!`;
            } else if (this.currentIteration == 8) {
                this.currentInterval = this.longBreak;
                this.alertText = `You finished your ${
                    this.longBreak / 60000
                }min break! Let's get back to work!`;
            }

            this.timerStartedTime = new Date();

            if (!this.textOnly) {
                const intervalResource = createAudioResource('sounds/time-over.ogg', { inputType: StreamType.OggOpus });
                this.player!.play(intervalResource);

                this.player!.once(AudioPlayerStatus.Idle, (state) => {
					const silenceFixerResource = createAudioResource('./sounds/silence-fixer.ogg', {
						inputType: StreamType.OggOpus 
					});

                    this.player!.play(silenceFixerResource);
                });
            }

            this.timer = setTimeout(() => {
                this.currentIteration++;

                //Send Text Alerts
                if (this.textAlerts) {
                    this.message.channel.send(this.alertText);
                }

				this.client.logger.info(`Pomodoro on server (${this.guild.name}, ${this.guild.id}) is on the iteration ${this.currentIteration}. Type: ${this.textOnly ? 'text' : 'voice'}`);

                //Send DM Alerts
                if (this.peopleToDm.length > 0) {
                    this.peopleToDm.forEach((user) => {
                        try {
                            this.client.users.fetch(user).then(u => u.send(this.alertText));
                        } catch (err) {
                            console.log(err);
                        }
                    });
                }

                //Start a New Cycle
                this.startANewCycle();
            }, this.currentInterval);
        } catch (err) {
            console.log(err);
        }
    }

    stopTimer() {
        clearTimeout(this.timer!);
        if (!this.textOnly) {
            this.player!.stop();
        }

		this.client.logger.info(`Pomodoro on server (${this.guild.id}, ${this.guild.name}) stopped`);
    }

    addToDM(id: string, message: Discord.Message) {
        if (this.peopleToDm.filter((person) => person == id).length == 0) {
            this.peopleToDm.push(id);
            message.reply('DM alerts enabled!');
        } else {
            this.peopleToDm = this.peopleToDm.filter((person) => person != id);
            message.reply('DM alerts disabled!');
        }
    }

    toggleNotifications(message: Discord.Message) {
        this.textAlerts = !this.textAlerts;

		message.channel.send('Text notifications have been turned ' + (this.textAlerts ? 'on' : 'off') + '!');
    }

    changeVolume(volume: number) {
        this.volume = volume;
    }
}
