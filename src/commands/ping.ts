import { Command } from "../Command";

export const command: Command = {
    infos: {
        name: "test-command",
        description: "Used to test some of the bot's fonctionnalities",
    },

    guildId: "598814767771156490",

    run: (client, commandInt) => {
        commandInt.reply("pong");
    },
};
