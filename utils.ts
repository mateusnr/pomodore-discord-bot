import { Command, ArgType, UserError } from "@sapphire/framework";

export async function handleArgs<T extends ArgType[keyof ArgType]>(argPicker: Promise<T>, defaultValue: number, ctx: Command) {
        return argPicker.catch((error) => {
            if (error.identifier === 'numberTooLarge' || error.identifier === 'numberTooSmall') {
                throw new UserError({identifier: 'OutOfBoundsInterval', message: 'Please insert a number between 5 and 120', context: ctx.toJSON()});     
            } else if (error.identifier === 'argsMissing') {
                return defaultValue;
            }
        });
    }