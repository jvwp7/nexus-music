const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'status',
    description: 'Veja o status do bot e informações do sistema',
    showHelp: true,

    async execute({ client, inter }) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('📊 Status do NEXUS MUSIC')
            .setDescription(
                '**🎵 Bot de Música Avançado**\n\n' +
                'Sistema funcionando perfeitamente!'
            )
            .addFields([
                {
                    name: '📈 Estatísticas',
                    value: `• **Servidores:** ${client.guilds.cache.size}\n• **Usuários:** ${client.users.cache.size}\n• **Comandos:** ${client.commands.size}\n• **Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: false
                },
                {
                    name: '⚡ Informações Técnicas',
                    value: `• **Versão:** 2.0.0\n• **Node.js:** ${process.version}\n• **Discord.js:** ${require('discord.js').version}\n• **Latência:** ${client.ws.ping}ms`,
                    inline: false
                },
                {
                    name: '🎵 Recursos',
                    value: '• Reprodução multi-plataforma\n• Fila avançada\n• Letras sincronizadas\n• Filtros de áudio\n• Controles interativos',
                    inline: false
                },
                {
                    name: '💚 Apoie o Projeto',
                    value: 'Use `n!doar` para apoiar o desenvolvimento!',
                    inline: false
                },
                {
                    name: '🔗 Links Úteis',
                    value: '• Discord: https://discord.gg/XVrXB37bRr\n• Email: suporte.nexusmusic@gmail.com',
                    inline: false
                }
            ])
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setImage('https://i.imgur.com/8tBXd6Q.gif')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await inter.editReply({ 
            embeds: [embed]
        });
    }
}; 