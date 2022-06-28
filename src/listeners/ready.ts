import { Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        client.user.setActivity('루루', {
            type: "STREAMING",
            url: "https://www.twitch.tv/prestigelulu"
        });
        client.application.commands.set(Commands);
        console.log(`${client.user.tag} 로그인 완료!`);
    });
};