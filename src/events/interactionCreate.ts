import { Interaction } from "discord.js";
import { DiscordEvent } from "../Event";

export const event: DiscordEvent = {
    run: (client, interaction: Interaction) => {
        if (interaction.isApplicationCommand()) {
            client.commands.cache
                .get(interaction.commandName)
                ?.run(client, interaction);
        }
    },
};
