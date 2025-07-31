const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = async (client, guild) => {
    try {
        // Encontrar o primeiro canal de texto onde o bot tem permissão para enviar mensagens
        const channel = guild.channels.cache.find(ch => 
            ch.type === 0 && // 0 = canal de texto
            ch.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) &&
            ch.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)
        );

        if (!channel) {
            console.log(`❌ Não foi possível encontrar um canal adequado no servidor ${guild.name}`);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('🎵 **Bot de Música Adicionado!**')
            .setDescription('Olá! Sou um bot de música avançado e estou aqui para melhorar sua experiência musical no Discord!')
            .addFields(
                { 
                    name: '🎶 **Comandos Principais**', 
                    value: '`n!tocar` - Reproduzir música\n`n!pausar` - Pausar música\n`n!retomar` - Retomar música\n`n!pular` - Pular música\n`n!parar` - Parar música\n`n!fila` - Ver fila de músicas', 
                    inline: false 
                },
                { 
                    name: '🎛️ **Controles Avançados**', 
                    value: '`n!volume` - Ajustar volume\n`n!embaralhar` - Embaralhar fila\n`n!repetir` - Ativar loop\n`n!letra` - Ver letra da música\n`n!tocando` - Música atual', 
                    inline: false 
                },
                { 
                    name: '🔍 **Busca e Reprodução**', 
                    value: 'Suporta YouTube, Spotify, SoundCloud e muito mais!\nBasta usar `n!tocar` seguido do nome da música ou URL.', 
                    inline: false 
                }
            )
            .addFields(
                { 
                    name: '📋 **Comandos Úteis**', 
                    value: '`n!ajuda` - Ver todos os comandos\n`n!ping` - Verificar latência do bot\n`n!doar` - Fazer uma doação\n`n!status` - Ver status do bot', 
                    inline: false 
                }
            )
            .setFooter({ 
                text: `🎵 NEXUS MUSIC • Servidor: ${guild.name} • Membros: ${guild.memberCount}`, 
                iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

        await channel.send({ embeds: [embed] });
        console.log(`✅ Embed de boas-vindas enviada no servidor ${guild.name} (${guild.id})`);

    } catch (error) {
        console.error(`❌ Erro ao enviar embed de boas-vindas no servidor ${guild.name}:`, error);
    }
}; 