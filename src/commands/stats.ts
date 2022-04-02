import { BaseCommandInteraction, MessageEmbedOptions } from "discord.js";
import { SuperClient } from "../bot";
import { Command } from "../Command";
import { globalInteractionDelay, colors } from "../configs/config.json";
import path from "path";

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

    const lang = require(path.normalize(
        __dirname + "/../lang/fr/commands/stats"
    )).default;

    return {
        title: lang.embed.title.replaceAll(
            "{{botName}}",
            client.user?.tag || "Indéfini"
        ),
        description: lang.embed.description
            ?.replaceAll(
                "{{guilds}}",
                globalValues?.guilds.toString() || "Indéfini"
            )
            .replaceAll(
                "{{members}}",
                globalValues?.members.toString() || "Indéfini"
            ),
        fields: values?.map((rV, i) => ({
            name: `Shard #${i}`,
            value: lang.embed.fields.value
                ?.replaceAll("{{guilds}}", rV.guilds.toString() || "Indéfini")
                .replaceAll("{{members}}", rV.members.toString() || "Indéfini"),
            inline: true,
        })),
        thumbnail: {
            url: client.user?.displayAvatarURL(),
        },
        color: [colors.embeds[0], colors.embeds[1], colors.embeds[2]],
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
