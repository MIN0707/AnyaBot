import {Client, Intents} from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import message from "./listeners/message";

const token = "OTg4MDM5MzI4NDY4OTcxNTYw.GH9fsB.TDR-7_ZMcgybW_QydvWBGySexiZTYx3uvw2-Zw";

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

message(client);
ready(client);
interactionCreate(client);

client.login(token).then();