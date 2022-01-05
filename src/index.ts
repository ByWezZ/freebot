import { Client, ClientOptions, User } from "discord.js";
import { promises as fs } from "fs";
import config from "./config.json";

import { Command } from "./Commands";

interface CommandManager {
    cache: Map<String[], Command>;
    members: Map<User, Command>;
}

class SuperClient extends Client {
    commands: CommandManager;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = {
            cache: new Map(),
            members: new Map(),
        };
    }
}

const client: SuperClient = new SuperClient({
    intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

/**
 * Handling events and commands
 */
client.on("ready", async () => {
    let commands = await fs.readdir(__dirname + "/commands");

    for (let commandFile of commands) {
        let commandInfo: Command = require(`${__dirname}/commands/${commandFile}`);

        client.commands.cache.set(commandInfo.names, commandInfo);
    }

    let events = await fs.readdir(__dirname + "/events");

    for (let eventFile of events) {
        let eventInfo = require(`${__dirname}/events/${eventFile}`);

        client.on(eventFile.split(".")[0], eventInfo.run.bind(null, client));
    }
});

client.login(process.env.FREEBOT || config.token);
