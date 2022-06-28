import {BaseCommandInteraction, Client, MessageEmbed} from 'discord.js';
import {Command} from '../Command';
import axios from "axios";

const {APEX_API_KEY} = require('../../config.json');

export const apex: Command = {
	name: '에펙',
	description: '에펙 플레이어를 정보를 가져올 수 있어!',
	type: 'CHAT_INPUT',
	options: [
		{
			name: '플랫폼',
			description: '플랫폼을 골라줘!',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: '컴퓨터',
					value: 'PC'
				},
				{
					name: '플스',
					value: 'PS4'
				},
				{
					name: '엑스박스(XBOX)',
					value: 'X1'
				},
				{
					name: '닌텐도 스위치',
					value: 'SWITCH'
				}
			]
		},
		{
			name: '닉네임',
			description: '플레이어의 이름을 적어줘!',
			type: 'STRING',
			required: true,
		}
		],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		if (interaction.options.get('플랫폼')?.value === null) {
			await interaction.followUp('Error code ANYA-03');
			return
		}
		if (interaction.options.get('닉네임')?.value === null) {
			await interaction.followUp('Error code ANYA-04');
			return
		}
		const platform = String(interaction.options.get('플랫폼')?.value).trim();
		const searchText = String(interaction.options.get('닉네임')?.value).trim();
		const APICallString = 'https://api.mozambiquehe.re/bridge?auth='+APEX_API_KEY+ '&player='+ encodeURIComponent(searchText)+'&platform=' + platform;
		axios.get(APICallString)
			.then((res) => {
				if(typeof res.data.Error !== 'undefined'){
					const errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('그게 누구야..?')
						.setDescription('플레이러를 찾을 수 없어 ㅠㅠ');
					interaction.followUp({embeds: [errorEmbed]});
					return;
				}
				const globalData = res.data.global;
				const realtimeData = res.data.realtime
				const legendsData = res.data.legends
				const total = res.data.total
				const image =legendsData.selected.ImgAssets;
				const successEmbed = new MessageEmbed()
					.setColor('#8bff5f')
					.setTitle(`이름 : ${globalData.name}`)
					.setDescription(`레벨 : ${globalData.level}`)
					.setThumbnail(globalData.rank.rankImg)
					.addField('\u200B', '\u200B')
					.addField('플랫폼', `${globalData.platform}`, true)
					.addField('랭크', `${globalData.rank.rankName} ${globalData.rank.rankDiv} ${globalData.rank.rankScore}점`, true)
					.addField('\u200B','\u200B', true)
					.addField('선택된 레전드', `${legendsData.selected.LegendName}`, true)
					.addField('총딜량', `${total.damage.value}`, true)
					.addField('총킬횟수', `${total.kills.value}`, true)
					.setImage(image.banner)
				interaction.followUp({embeds: [successEmbed]});
			})
			.catch(error => {
				let errorEmbed;
				if(error.message.includes('429'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('2초후 다시 입력해줘!')
						.setDescription(`너무 빨리 API를 호출했어!ㅠ`);
				}else if(error.message.includes('400'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('몇분후에 다시해줘!')
						.setDescription(`API가 열이났나봐 ㅠㅠ`);
				}else if(error.message.includes('403'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('API키를 알수없어 ㅠㅠ')
						.setDescription(`날 만든 @루루#1212를 호출해줘`);
				}else if(error.message.includes('404'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('그게 누구야..?')
						.setDescription('플레이러를 찾을 수 없어 ㅠㅠ');
				}else if(error.message.includes('405'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('API오류야.. 에이펙스 문제,')
						.setDescription(`언제까지 기다려야하지..`);
				}else if(error.message.includes('410'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('플랫폼이 잘못선택된것같아')
						.setDescription(`컴퓨터 엑스박스 플스 닌텐도스위치 중에 선택해줘`);
				}else if(error.message.includes('500'))
				{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('내부오류')
						.setDescription(`..`);
				}else{
					errorEmbed = new MessageEmbed()
						.setColor('#FF0000')
						.setTitle('에이펙스 에러!')
						.setDescription(`${error}`);
				}
				interaction.followUp({embeds: [errorEmbed]});
			})
	}
};