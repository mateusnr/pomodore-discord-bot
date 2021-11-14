import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnection } from "@discordjs/voice";
import Discord from "discord.js";

export default class Pomodoro {
    client: Discord.Client;

    workTime: number;
    smallBreak: number;
    bigBreak: number;
    interval?: number;
    connection?: VoiceConnection;
    guild: Discord.Guild;
    message: Discord.Message;
    textOnly: boolean;

    time: number;
    textAlerts: boolean;
    volume: number;

    peopleToDm: string[];

    timerStartedTime: Date; 
    alertText: string; 

    timer?: NodeJS.Timeout;
    player?: AudioPlayer;

    constructor(
        client: Discord.Client,
        workTime: number,
        smallBreak: number,
        bigBreak: number,
        guild: Discord.Guild,
        message: Discord.Message,
        textOnly: boolean
    ) {
        this.client = client;
        this.guild = guild;
        this.workTime = workTime;
        this.smallBreak = smallBreak;
        this.bigBreak = bigBreak;
        this.peopleToDm = [];
        this.textAlerts = true;
        this.volume = 0.5;
        this.message = message;
        this.time = 1;
        this.timerStartedTime = new Date();
        this.alertText = '';
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
                const intervalResource = createAudioResource('sounds/time-over.ogg', { inputType: StreamType.OggOpus });
                this.player!.play(intervalResource);

                this.player!.on(AudioPlayerStatus.Idle, (state) => {
					const silenceFixerResource = createAudioResource('./sounds/silence-fixer.ogg', {
						inputType: StreamType.OggOpus 
					});

                    this.player!.play(silenceFixerResource);
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
            }, this.interval);
        } catch (err) {
            console.log(err);
        }
    }

    stopTimer() {
        clearTimeout(this.timer!);
        if (!this.textOnly) {
            this.player!.stop();
        }
    }

    addToDM(id: string, message: Discord.Message) {
        if (this.peopleToDm.filter((person) => person == id).length == 0) {
            this.peopleToDm.push(id);
            message.reply('you will now receive the alerts via Direct Message!');
        } else {
            this.peopleToDm = this.peopleToDm.filter((person) => person != id);
            message.reply('you will stop receiving the alerts via Direct Message!');
        }
    }

    toggleNotifications(message: Discord.Message) {
        this.textAlerts = !this.textAlerts;

        if (this.textAlerts) {
            message.channel.send('The text notifications have been turned on!');
        } else {
            message.channel.send('The text notifications have been turned off!');
        }
    }

    changeVolume(volume: number) {
        this.volume = volume;
    }
}
