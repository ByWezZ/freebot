import { Command } from "../Commands";

export const command: Command = {
    names: ["ping"],

    description: "Respond with pong",

    run: (client, message, args) => {
        message.reply("pong");
    },
};
