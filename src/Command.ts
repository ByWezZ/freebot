import {
    ApplicationCommand,
    ApplicationCommandData,
    BaseCommandInteraction,
} from "discord.js";
import { SuperClient } from ".";

export interface Command {
    infos: ApplicationCommandData;
    appCommand?: ApplicationCommand;

    guildId?: string;

    run: (client: SuperClient, interaction: BaseCommandInteraction) => void;
}
