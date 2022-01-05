import { Message } from "discord.js";
import { SuperClient } from "../index";
import { prefix } from "../config.json";

export function run(client: SuperClient, message: Message): void {
    // Command handling
    if (!message.content.startsWith(prefix)) return;
    message.content = message.content.slice(prefix.length);

    let args = message.content.split(/ +/);
    let commandName = args.shift() ?? "";

    let command = client.commands.cache.find((_, names) =>
        names.includes(commandName)
    );

    if (
        !command ||
        (command.admin && !message.member?.permissions.has("ADMINISTRATOR"))
    )
        return;

    command.run(client, message, args, commandName);
}
