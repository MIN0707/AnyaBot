import { Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        client.application.commands.set(Commands);
        console.log(`${client.user.tag} 로그인 완료!`);
    });
};