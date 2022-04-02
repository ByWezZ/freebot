import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { SuperClient } from ".";

export interface Command {
    infos: ApplicationCommandData;

    run: (client: SuperClient, interaction: CommandInteraction) => void;
}
