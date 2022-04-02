import { Command } from "../Command";

export const command: Command = {
    infos: {
        name: "ping",
        description: "Ping command",
    },

    run: (client, commandInt) => {
        commandInt.reply("pong with " + client.ws.ping + "ms");
    },
};
