import { ApplicationCommandData, Client, CommandInteraction } from "discord.js";

export interface Command {
    infos: ApplicationCommandData;

    run: (client: Client, message: CommandInteraction) => void;
}
