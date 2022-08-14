import { MessageCommandErrorPayload, Events, Listener, UserError } from "@sapphire/framework";

export class CommandErrorListener extends Listener<typeof Events.MessageCommandError> {
    run(error: UserError, payload: MessageCommandErrorPayload) {
        return payload.message.reply(error.message);
    }
}
