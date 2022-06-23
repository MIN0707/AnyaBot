import {BaseCommandInteraction, Client} from "discord.js";
import {Command} from "../Command";
import {entersState, VoiceConnectionStatus} from "@discordjs/voice";
const { joinVoiceChannel } = require('@discordjs/voice');

export const JOIN: Command = {
    name: '입장',
    description: '봇이 음성 채널에 입장합니다',
    type: 'CHAT_INPUT',
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if(interaction.guild===null)return;
        const content = "봇이 입장합니다!";
        const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        await entersState(connection, VoiceConnectionStatus.Connecting, 5_000).catch(error=>console.log(error));
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};