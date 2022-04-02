import {
    ApplicationCommand,
    ApplicationCommandData,
    BaseCommandInteraction,
} from "discord.js";
import { SuperClient } from ".";

export interface Command {
    infos: ApplicationCommandData;
    appCommand?: ApplicationCommand;

    run: (client: SuperClient, interaction: BaseCommandInteraction) => void;
}
