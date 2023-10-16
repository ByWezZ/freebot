import { ShardingManager } from "discord.js";
import { config } from "dotenv";
config();

const manager = new ShardingManager(__dirname + "/bot.js", {
    token: process.env.TOKEN as string,
    totalShards: 15,
});

manager.on("shardCreate", (shard) =>
    console.log(`- Launched shard ${shard.id}`)
);

manager.spawn();
