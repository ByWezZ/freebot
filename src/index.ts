import Discord from "discord.js";
import config from "./config.json";

const client = new Discord.Client({
    intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

client.login(config.token);
