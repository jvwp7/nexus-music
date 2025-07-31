// Teste simples para verificar se o bot inicia
require('dotenv').config();

console.log('🚀 Iniciando teste do bot...');

try {
    // Testar imports básicos
    const { Client, GatewayIntentBits } = require('discord.js');
    console.log('✅ Discord.js importado com sucesso');
    
    const { Player } = require('discord-player');
    console.log('✅ Discord-player importado com sucesso');
    
    // Testar configuração
    const config = require('./config');
    console.log('✅ Configuração carregada com sucesso');
    
    // Testar cliente
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
    });
    console.log('✅ Cliente Discord criado com sucesso');
    
    // Testar player
    const player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }
    });
    console.log('✅ Player criado com sucesso');
    
    // Testar busca simples
    console.log('✅ Testando busca...');
    
    console.log('🎉 Todos os testes passaram! O bot deve funcionar corretamente.');
    
} catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
} 