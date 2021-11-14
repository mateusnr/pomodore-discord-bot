import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { HELP_MESSAGE_EMBED } from "../constants";

export class PomodoroHelpCommand extends Command {
    public async messageRun(message: Message) {
        message.channel.send({ embeds: [HELP_MESSAGE_EMBED] });
    }
}