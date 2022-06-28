import {BaseCommandInteraction, Client} from 'discord.js';
import {Command} from '../Command';

export const test: Command = {
    name: 'test',
    description: 'test',
    type: 'CHAT_INPUT',
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            content: "test"
        });
    }
};