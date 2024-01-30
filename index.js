import dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits } from 'discord.js'; // Importing Client and Intents from discord.js
const token = process.env.DISCORD_TOKEN;

const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    // Check if the message starts with the command prefix and is not from a bot
    if (message.content.startsWith('nkhd') && !message.author.bot) {
        const args = message.content.slice('!move'.length).trim().split(/ +/);
        const mention = args.shift(); // Extract the mention
        const userID = mention.replace(/[<@!>]/g, ''); // Extract user ID from mention and remove mention formatting
        const name = message.guild.members.cache.get(userID); // Get member by user ID
        const n = parseInt(args[0]);

        if (!isNaN(n) && name) {
            const voiceChannels = message.guild.channels.cache.filter(channel => channel.type == 2);
            const startVoiceChannel = name.voice.channel

            for (let i = 0; i < n; i++) {
                const currentVoiceChannel = name.voice.channel;
                
                // Filter out the current and used channels from the list of available channels
                const availableVoiceChannels = voiceChannels
                    .filter(channel => channel.id !== currentVoiceChannel.id);

                if (availableVoiceChannels.size > 0) {
                    const randomChannel = availableVoiceChannels.random();
                    try {
                        await name.voice.setChannel(randomChannel);
                        console.log(`Moved ${name.user.username} to ${randomChannel}`);
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    console.log(`No available voice channels to move ${name.user.username}`);
                    break;
                }
            }

            try {
                await name.voice.setChannel(startVoiceChannel);
                console.log(`Moved ${name.user.username} to ${startVoiceChannel}`);
            } catch (error) {
                console.error(error);
            }

        } else {
            message.reply('Please provide a valid user mention and a valid number.');
        }
    }
});

client.login(token);
