import { BaseCommandInteraction, MessageEmbedOptions } from "discord.js";
import { SuperClient } from "../bot";
import { Command } from "../Command";
import { globalInteractionDelay } from "../configs/config.json";

/**
 * @param {SuperClient} client The discord client
 * @param {BaseCommandInteraction} interaction The interaction
 * @param {Number} page The page to display
 *
 * @returns {MessageEmbed} The embed corresponding to the page
 */
async function getEmbed(
    client: SuperClient,
    interaction: BaseCommandInteraction,
    page: Number
): Promise<MessageEmbedOptions> {
    let values = await client.shard?.broadcastEval((client) => {
        return {
            guilds: client.guilds.cache.size,
            members: client.guilds.cache
                .map((g) => g.memberCount)
                .reduce((a, c) => a + c, 0),
        };
    });

    let globalValues = values?.reduce((a, c) => ({
        guilds: a.guilds + c.guilds,
        members: a.members + c.members,
    }));

    return {
        title: "Statistiques de " + client.user?.tag,
        description: `__**Nombre de serveurs :**__ ${globalValues?.guilds}\n__**Nombre de membres :**__ ${globalValues?.members}`,
        timestamp: new Date(),
        footer: {
            text: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
        },
    };
}

export const command: Command = {
    infos: {
        name: "stats",
        description: "Display bot's statistics",
    },

    guildId: "598814767771156490",

    run: async (client, commandInt) => {
        commandInt.reply({
            embeds: [await getEmbed(client, commandInt, 0)],
        });
    },
};
