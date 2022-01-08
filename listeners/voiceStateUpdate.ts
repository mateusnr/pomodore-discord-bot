import { getVoiceConnection } from "@discordjs/voice";
import { Listener, Events } from "@sapphire/framework";
import { VoiceChannel, VoiceState } from "discord.js";
import PomodoroContainer from "../container";

const MINUTE_IN_MS = 60000;

export class VoiceStateUpdateListener extends Listener<typeof Events.VoiceStateUpdate> {
	timeout?: NodeJS.Timeout;

	// TODO: logging
	run(oldState: VoiceState, newState: VoiceState) {
		// user joined a voice channel
		if (!oldState.channel && newState.channel) {
			if (this.timeout) {
				const channelMembers = newState.channel.members;
				const numOfParticipants = channelMembers.size;

				if (numOfParticipants > 1 && channelMembers.has(this.container.client.id!)) { // another person joined, cancel timeout 
					clearTimeout(this.timeout);
					delete this.timeout;
				}
			}
		} else if (oldState.channel && !newState.channel) { // user left a voice channel
			const channelMembers = oldState.channel.members;
			const numOfParticipants = channelMembers.size;

			if (numOfParticipants == 1 && channelMembers.has(this.container.client.id!)) { // only the bot is on the channel
				this.timeout = setTimeout(this.closePomodoroAndDisconnect, 3 * MINUTE_IN_MS, oldState.channel as VoiceChannel);
			}
		}
	}

	closePomodoroAndDisconnect(channel: VoiceChannel) {
		const connection = getVoiceConnection(channel.guild.id);
		connection?.destroy();
		PomodoroContainer.getInstance().removePomodoro(channel.guild.id);
	}
}
