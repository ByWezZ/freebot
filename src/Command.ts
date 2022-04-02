import {
    ApplicationCommand,
    ApplicationCommandData,
    BaseCommandInteraction,
} from "discord.js";
import { SuperClient } from "./bot";

export interface Command {
    infos: ApplicationCommandData;
    appCommand?: ApplicationCommand;

    guildId?: string;

    run: (client: SuperClient, interaction: BaseCommandInteraction) => void;
}
