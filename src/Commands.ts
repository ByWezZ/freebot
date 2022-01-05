import { Client, Message } from "discord.js";

export interface Command {
    names: Array<String>;
    description: String;

    admin?: boolean; // should this command be admin only ?
    hide?: boolean; // Should this command apear in help command ?

    run: (
        client: Client,
        message: Message,
        args: String[],
        commandName: String
    ) => void;
}
