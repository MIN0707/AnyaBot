import {Client, Message, MessageEmbed} from "discord.js";
import {Rcon} from 'rcon-client'
import axios from "axios";
import internal from "stream";

const {API_KEY} = require('../../config.json');

export default (client: Client): void => {
    client.on('messageCreate', async (message: Message) => {
        if (!client.user || !client.application) {
            return;
        }
        if (message.author.bot) return;
        let startswith = '';
        if (message.content.startsWith('<@' + client.user.id + '> ') || message.content.startsWith('<@' + client.user.id + '>')) {
            startswith = '<@' + client.user.id + '>';
        } else if (message.content.startsWith('<@&989464441915592756> ') || message.content.startsWith('<@&989464441915592756>')) {
            startswith = '<@&989464441915592756>';
        } else return;
        const command = message.content.toLowerCase().split(startswith)[1].trim();
        if (command.startsWith('롤')) {
            const searchText = command.split('롤')[1];
            if(searchText.trim() === ''){
                await message.reply('닉네임을 입력해줘!');
                return;
            }
            const APICallString = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + searchText + '?api_key=' + API_KEY;
            axios.get(APICallString)
                .then((res) => {
                    const image = 'https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/' + res.data.profileIconId + '.png';
                    axios.get('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + res.data.id + '?api_key=' + API_KEY)
                        .then((respone) =>{
                            const data = respone.data[0];
                            if(data===undefined)
                            {
                                const successEmbed = new MessageEmbed()
                                    .setColor('#8bff5f')
                                    .setTitle(`소환사 이름 : ${res.data.name}`)
                                    .setDescription(`레벨 : ${res.data.summonerLevel}`)
                                    .setThumbnail(image)
                                    .setImage('https://cdn.discordapp.com/attachments/989464083441025056/989503510460633100/logo.jpg')
                                message.reply({embeds: [successEmbed]});
                                return;
                            }
                            const successEmbed = new MessageEmbed()
                                .setColor('#8bff5f')
                                .setTitle(`소환사 이름 : ${res.data.name}`)
                                .setDescription(`레벨 : ${res.data.summonerLevel}`)
                                .setThumbnail(image)
                                .addField('\u200B', '\u200B')
                                .addField('티어', `${data.tier===undefined?'없음':data.tier} ${data.rank===undefined?'':data.rank}`, true)
                                .addField('포인트', `${data.leaguePoints}`, true)
                                .addField('\u200B', '\u200B', true)
                                .addField('이긴 횟수', `${data.wins}`, true)
                                .addField('진 횟수', `${data.losses}`, true)
                                .addField('총 판', `${data.losses + data.wins}`, true)
                                .setImage('https://cdn.discordapp.com/attachments/989464083441025056/989503510460633100/logo.jpg')
                            message.reply({embeds: [successEmbed]});
                        })
                        .catch(error=>{
                            const errorEmbed = new MessageEmbed()
                                .setColor('#FF0000')
                                .setTitle('티어를 찾을 수 없습니다')
                                .setDescription(`${error}`);
                            message.reply({embeds: [errorEmbed]});
                        })
                })
                .catch(error => {
                    const errorEmbed = new MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle('해당 소환사를 찾을 수 없습니다')
                        .setDescription(`${error}`);
                    message.reply({embeds: [errorEmbed]});
                })
        }
        else if (command.startsWith('rcon')) {
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
                await message.reply({embeds: [errorEmbed]});
                return;
            }
            if (rcon instanceof Rcon) {
                const result = await rcon.send(command.split('rcon')[1]);
                const successEmbed = new MessageEmbed()
                    .setColor('#8bff5f')
                    .setTitle('Rcon이 작동 되었습니다')
                    .setDescription(`${result}`);
                await message.reply({embeds: [successEmbed]});
                return;
            }
        }
        else if (command.startsWith('가위바위보')) {
            const searchText = command.split('가위바위보')[1].trim();
            let random = createRandomNumber(1,3);
            if(searchText === ''){
                await message.reply('가위 바위 보 중 아무거나 선택해줘!');
                return;
            }
            //1 가위 2 바위 3 보
            if(searchText ==='가위')
            {
                if(random===1)
                {
                    await message.reply('나는 가위를 냈어! 비겼네 다시하쟈')
                }else if(random===2)
                {
                    await message.reply('나는 바위를 냈어! 내가 이겼당! 하하')
                }else if(random===3)
                {
                    await message.reply('나는 보를 냈어! 내가 지다니 흑흐규')
                }else{
                    await message.reply(`${random}`);
                }
            }else if(searchText ==='바위')
            {
                if(random===1)
                {
                    await message.reply('나는 가위를 냈어! 내가 지다니 흑흐규')
                }else if(random===2)
                {
                    await message.reply('나는 바위를 냈어! 비겼네 다시하쟈 ㅎㅎ')
                }else if(random===3)
                {
                    await message.reply('나는 보를 냈어! 내가 이겼당! 하하')
                }else{
                    await message.reply(`${random}`);
                }
            }else if(searchText ==='보')
            {
                if(random===1)
                {
                    await message.reply('나는 가위를 냈어! 내가 이겼당! 하하')
                }else if(random===2)
                {
                    await message.reply('나는 바위를 냈어! 내가 지다니 흑흐규')
                }else if(random===3)
                {
                    await message.reply('나는 보를 냈어! 비겼네 다시하쟈')
                }else{
                    await message.reply(`${random}`);
                }
            }else{
                await message.reply('가위 바위 보 중 선택해줘!')
            }
        }
        else {
            const successEmbed = new MessageEmbed()
                .setColor('#8bff5f')
                .setTitle('도움말')
                .setDescription('명령어를 사용하고 싶으면 아냐를 태그한다음 명령어를 적어줘!')
                .addField('롤 플레이어 검색', startswith + ' 롤 name', true)
                .addField('RCON 명령어 실행', startswith + ' rcon command', true)
                .addField('가위바위보', startswith + ' 가위바위보 <가위,바위,보>', true)
            await message.reply({embeds: [successEmbed]});
        }
    });
    function createRandomNumber(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};