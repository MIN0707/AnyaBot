import {Client, Message, MessageEmbed} from "discord.js";
import {Rcon} from 'rcon-client'

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
        if (command.startsWith('가위바위보')) {
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
                .addField('가위바위보', startswith + ' 가위바위보 <가위,바위,보>', true)
            await message.reply({embeds: [successEmbed]});
        }
    });
    function createRandomNumber(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};