import config from "./configs/config.json";
import { ShardingManager } from "discord.js";

const manager = new ShardingManager(__dirname + "/bot.js", {
    token: process.env.FREEBOT || config.token,
});

manager.on("shardCreate", (shard) =>
    console.log(`- Launched shard ${shard.id}`)
);

manager.spawn();
