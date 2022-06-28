import {BaseCommandInteraction, Client, MessageEmbed} from 'discord.js';
import {Command} from '../Command';
import {Rcon} from "rcon-client";

export const minecraftCommand: Command = {
	name: '마크명령어',
	description: '마크명령어를 디코에서 칠수있어!',
	type: 'CHAT_INPUT',
	options: [{
		name: '명령어',
		description: '실행할 명령어를 적어줘!',
		type: 'STRING',
		required: true
	}],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		if (interaction.options.get('명령어')?.value === null) {
			await interaction.followUp('Error code ANYA-02');
			return
		}
		const command = String(interaction.options.get('명령어')?.value).trim();
		let isError = false;
		let errorMessage = '';
		const rcon = await Rcon.connect({
			host: "127.0.0.1", port: 19132, password: "alsrb2228!"
		})
			.catch(error => {
				errorMessage = `${error}`;
				isError = true;
			});
		if (isError) {
			const errorEmbed = new MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Rcon 연결이 거부되었습니다..ㅠㅠ')
				.setDescription(errorMessage);
			await interaction.followUp({embeds: [errorEmbed]});
			return;
		}
		if (rcon instanceof Rcon) {
			const result = await rcon.send(command);
			const successEmbed = new MessageEmbed()
				.setColor('#8bff5f')
				.setTitle('Rcon이 작동 되었습니다')
				.setDescription(`${result}`);
			await interaction.followUp({embeds: [successEmbed]});
			await rcon.end();
			return;
		}
	}
};