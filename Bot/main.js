require('dotenv').config();

const { Player } = require('discord-player');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { SpotifyExtractor } = require('@discord-player/extractor');
const botStats = require('./stats');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    disableMentions: 'everyone',
});

client.config = require('./config');

// Inicializar o player corretamente
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    },
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 30000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 30000,
    spotifyBridge: true,
    volume: 75
});

// Registrar extractors
try {
    player.extractors.register(YoutubeiExtractor, {});
    player.extractors.register(SpotifyExtractor, {});
    console.log('✅ Extractors registrados com sucesso');
} catch (error) {
    console.error('❌ Erro ao registrar extractors:', error);
}

// Tornar o player globalmente acessível
global.player = player;

console.clear();
require('./loader');

// Sistema de comandos com prefixo n!
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const prefix = 'n!';
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    
    if (!command) return;
    
    try {
        // Criar um objeto inter simulado mais completo
        const inter = {
            member: message.member,
            guild: message.guild,
            channel: message.channel,
            user: message.author,
            options: {
                getString: (name) => {
                    // Para comandos de música, retornar todos os argumentos restantes
                    if (name === 'musica' || name === 'musica') {
                        const musicArgs = args.join(' ');
                        console.log('Argumentos de música:', musicArgs);
                        return musicArgs;
                    }
                    if (name === 'tempo') return args[0] || '';
                    if (name === 'valor') return parseInt(args[0]) || 50;
                    if (name === 'numero') return parseInt(args[0]) || 1;
                    if (name === 'filtro') return args[0] || '';
                    if (name === 'acao') return args[0] || '';
                    return args.join(' ');
                },
                getNumber: (name) => {
                    if (name === 'valor') return parseInt(args[0]) || 50;
                    if (name === 'numero') return parseInt(args[0]) || 1;
                    return parseInt(args[0]) || 0;
                },
                getChannel: (name) => message.channel
            },
            editReply: async (data) => {
                try {
                    if (data.embeds) {
                        return message.reply({ embeds: data.embeds, components: data.components || [] });
                    } else if (typeof data === 'string') {
                        return message.reply(data);
                    } else {
                        return message.reply('Comando executado com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro no editReply:', error);
                    return message.reply('Erro ao executar comando.');
                }
            },
            reply: async (data) => {
                try {
                    if (data.embeds) {
                        return message.reply({ embeds: data.embeds, components: data.components || [] });
                    } else if (typeof data === 'string') {
                        return message.reply(data);
                    } else {
                        return message.reply('Comando executado com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro no reply:', error);
                    return message.reply('Erro ao executar comando.');
                }
            },
            followUp: async (data) => {
                try {
                    if (data.embeds) {
                        return message.reply({ embeds: data.embeds, components: data.components || [] });
                    } else if (typeof data === 'string') {
                        return message.reply(data);
                    } else {
                        return message.reply('Comando executado com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro no followUp:', error);
                    return message.reply('Erro ao executar comando.');
                }
            }
        };
        
        await command.execute({ client, inter });
    } catch (error) {
        console.error('Erro ao executar comando:', error);
        
        // Enviar mensagem de erro mais amigável
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Erro ao executar o comando')
            .setDescription('Ocorreu um erro ao executar o comando. Tente novamente ou verifique os parâmetros.')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Se o erro persistir, contate o suporte', 
                iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();
        
        try {
            await message.reply({ embeds: [errorEmbed] });
        } catch (replyError) {
            console.error('Erro ao enviar mensagem de erro:', replyError);
        }
    }
});

// Atualizar estatísticas quando o bot ficar online
client.on('ready', () => {
    console.log(`Bot online como ${client.user.tag}`);
    botStats.updateServerCount(client);
    
    // Atualizar estatísticas a cada 5 minutos
    setInterval(() => {
        botStats.updateServerCount(client);
    }, 5 * 60 * 1000);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tChange the token in the config file\n');
    } else {
        console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e);
    }
});
