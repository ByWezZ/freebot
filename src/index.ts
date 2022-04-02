import { Client, ClientOptions, Collection, User } from "discord.js";
import { promises as fs } from "fs";
import config from "./config.json";

import { Command } from "./Command";

class CommandManager {
    cache: Collection<String, Command>;
    members: Map<User, Command>;

    constructor() {
        this.cache = new Collection();
        this.members = new Map();
    }

    public async reload() {
        let commands = await fs.readdir(__dirname + "/commands");

        for (let commandFile of commands) {
            if (!commandFile.endsWith(".js")) continue;

            delete require.cache[commandFile];

            const commandInfo: Command =
                require(`${__dirname}/commands/${commandFile}`).command;

            client.commands.cache.set(commandInfo.infos.name, commandInfo);
        }
    }
}

export class SuperClient extends Client {
    commands: CommandManager;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new CommandManager();
    }
}

const client = new SuperClient({
    intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

/**
 * Handling events and commands
 */
client.on("ready", async () => {
    // Loads all commands
    client.commands.reload();

    let events = await fs.readdir(__dirname + "/events");

    for (let eventFile of events) {
        if (!eventFile.endsWith(".js")) continue;

        const { run } = require(`${__dirname}/events/${eventFile}`);

        client.on(eventFile.split(".")[0], run.bind(null, client));
    }

    console.log("Bot started");
});

client.login(process.env.FREEBOT || config.token);
