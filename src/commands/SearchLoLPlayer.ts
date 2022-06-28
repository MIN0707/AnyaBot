import {BaseCommandInteraction, Client, MessageEmbed} from 'discord.js';
import {Command} from '../Command';
import axios from "axios";

const {RIOT_API_KEY} = require('../../config.json');

export const SearchLoLPlayer: Command = {
	name: '롤',
	description: '롤 플레이어를 정보를 가져올 수 있어!',
	type: 'CHAT_INPUT',
	options: [{
		name: '닉네임',
		description: '플레이어의 이름을 적어줘!',
		type: 'STRING',
		required: true
	}],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		if (interaction.options.get('닉네임')?.value === null) {
			await interaction.followUp('Error code ANYA-01');
			return
		}
		const searchText = String(interaction.options.get('닉네임')?.value).trim();
		const APICallString = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(searchText) + '?RIOT_API_KEY=' + RIOT_API_KEY;
		axios.get(APICallString)
			.then((res) => {
				const image = 'https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/' + res.data.profileIconId + '.png';
				axios.get('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + res.data.id + '?RIOT_API_KEY=' + RIOT_API_KEY)
					.then((respone) => {
						const data = respone.data[0];
						if (data === undefined) {
							const successEmbed = new MessageEmbed()
								.setColor('#8bff5f')
								.setTitle(`소환사 이름 : ${res.data.name}`)
								.setDescription(`레벨 : ${res.data.summonerLevel}`)
								.setThumbnail(image)
								.setImage('https://cdn.discordapp.com/attachments/989464083441025056/989503510460633100/logo.jpg')
							interaction.followUp({embeds: [successEmbed]});
							return;
						}
						const successEmbed = new MessageEmbed()
							.setColor('#8bff5f')
							.setTitle(`소환사 이름 : ${res.data.name}`)
							.setDescription(`레벨 : ${res.data.summonerLevel}`)
							.setThumbnail(image)
							.addField('\u200B', '\u200B')
							.addField('티어', `${data.tier === undefined ? '없음' : data.tier} ${data.rank === undefined ? '' : data.rank}`, true)
							.addField('포인트', `${data.leaguePoints}`, true)
							.addField('\u200B', '\u200B', true)
							.addField('이긴 횟수', `${data.wins}`, true)
							.addField('진 횟수', `${data.losses}`, true)
							.addField('총 판', `${data.losses + data.wins}`, true)
							.setImage('https://cdn.discordapp.com/attachments/989464083441025056/989503510460633100/logo.jpg')
						interaction.followUp({embeds: [successEmbed]});
					})
					.catch(error => {
						const errorEmbed = new MessageEmbed()
							.setColor('#FF0000')
							.setTitle('플레이어 정보가 망가졌습니다')
							.setDescription(`${error}`);
						interaction.followUp({embeds: [errorEmbed]});
					})
			})
			.catch(error => {
				const errorEmbed = new MessageEmbed()
					.setColor('#FF0000')
					.setTitle('해당 소환사를 찾을 수 없습니다')
					.setDescription(`${error}`);
				interaction.followUp({embeds: [errorEmbed]});
			})
	}
};