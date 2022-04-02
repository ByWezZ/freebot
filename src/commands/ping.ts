import { Command } from "../Commands";

export const command: Command = {
    infos: {
        name: "testCommand",
        description: "Used to test some of the bot's fonctionnalities",
    },

    run: (client, commandInt) => {
        commandInt.reply("pong");
    },
};
