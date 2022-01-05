import { Client, ClientOptions, User } from "discord.js";
import { promises as fs } from "fs";
import config from "./config.json";

import { Command } from "./Commands";

class CommandManager {
    cache: Map<String[], Command>;
    members: Map<User, Command>;

    constructor() {
        this.cache = new Map();
        this.members = new Map();
    }

    public async reload() {
        let commands = await fs.readdir(__dirname + "/commands");

        for (let commandFile of commands) {
            delete require.cache[commandFile];

            let commandInfo: Command = require(`${__dirname}/commands/${commandFile}`);

            client.commands.cache.set(commandInfo.names, commandInfo);
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
        if (eventFile.endsWith(".js")) {
            const { run } = require(`${__dirname}/events/${eventFile}`);

            client.on(eventFile.split(".")[0], run.bind(null, client));
        }
    }

    console.log("Bot started");
});

client.login(process.env.FREEBOT || config.token);
