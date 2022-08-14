import { Events, Listener, MessageCommandDeniedPayload, UserError } from "@sapphire/framework";

export class CommandDeniedListener extends Listener<typeof Events.MessageCommandDenied> {
    public run(error: UserError, payload: MessageCommandDeniedPayload) {
        payload.message.reply(error.message);
    }

}