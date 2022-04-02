import {
    BaseCommandInteraction,
    InteractionReplyOptions,
    Message,
} from "discord.js";
import { SuperClient } from "../bot";
import { Command } from "../Command";
import { globalInteractionDelay, colors } from "../configs/config.json";
import path from "path";

/**
 * @param {SuperClient} client The discord client
 * @param {BaseCommandInteraction} interaction The interaction
 * @param {Number} page The page to display
 *
 */
async function statsFunction(
    client: SuperClient,
    interaction: BaseCommandInteraction,
    page: number
) {
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

    let messageData: InteractionReplyOptions = {
        fetchReply: true,

        embeds: [
            {
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
                fields: values
                    ?.slice(page * 24, (page + 1) * 25)
                    .map((rV, i) => ({
                        name: `Shard #${i + page * 25}`,
                        value: lang.embed.fields.value
                            ?.replaceAll(
                                "{{guilds}}",
                                rV.guilds.toString() || "Indéfini"
                            )
                            .replaceAll(
                                "{{members}}",
                                rV.members.toString() || "Indéfini"
                            ),
                        inline: true,
                    })),
                thumbnail: {
                    url: client.user?.displayAvatarURL(),
                },
                color: [colors.embeds[0], colors.embeds[1], colors.embeds[2]],
                timestamp: new Date(),
                footer: {
                    text: `${interaction.user.tag} | ${page + 1} / ${Math.ceil(
                        (client.shard?.count || 1) / 25
                    )}`,
                    iconURL: interaction.user.displayAvatarURL(),
                },
            },
        ],

        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        style: "PRIMARY",
                        label: lang.components.previous,
                        disabled: page <= 0,
                        customId: "stats-previous",
                    },
                    {
                        type: "BUTTON",
                        style: "PRIMARY",
                        label: lang.components.next,
                        disabled:
                            page + 1 >=
                            Math.ceil((client.shard?.count || 1) / 25),
                        customId: "stats-next",
                    },
                ],
            },
        ],
    };

    let question = await (interaction.replied
        ? interaction.editReply(messageData)
        : interaction.deferReply(messageData)
    ).catch(() => undefined);

    if (question instanceof Message) {
        let buttonInt = await question
            .awaitMessageComponent({
                filter: (int) => int.user.id == interaction.user.id,
                time: globalInteractionDelay,
            })
            .catch(() => undefined);

        switch (buttonInt?.customId) {
            case "stats-next":
                statsFunction(client, interaction, page + 1);
                break;
            case "stats-previous":
                statsFunction(client, interaction, page - 1);
                break;

            default:
                interaction.editReply({ components: [] });
        }
    } else {
        interaction.editReply({ components: [] });
    }
}

export const command: Command = {
    infos: {
        name: "stats",
        description: "Display bot's statistics",
    },

    guildId: "598814767771156490",

    run: async (client, commandInt) => {
        statsFunction(client, commandInt, 0);
    },
};
