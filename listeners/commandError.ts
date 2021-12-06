import { Args, CommandErrorPayload, Events, Listener, UserError } from "@sapphire/framework";

export class CommandErrorListener extends Listener<typeof Events.CommandError> {
    run(error: UserError, payload: CommandErrorPayload<Args>) {
        return payload.message.reply(error.message);
    }
}
