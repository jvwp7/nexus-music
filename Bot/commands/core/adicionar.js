const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'adicionar',
    description: 'Receba o link para adicionar o bot em seu servidor!',
    showHelp: true,

    async execute({ client, inter }) {
        const clientId = client.user.id;
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=314880&scope=bot%20applications.commands`;
        
        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('🎵 **NEXUS MUSIC - Bot de Música**')
            .setDescription('**Adicione o NEXUS MUSIC ao seu servidor e transforme sua experiência musical!**\n\n' +
                          '✨ **Recursos Principais:**\n' +
                          '• Reprodução de YouTube, Spotify, SoundCloud\n' +
                          '• Fila avançada com controles intuitivos\n' +
                          '• Letras sincronizadas em tempo real\n' +
                          '• Filtros de áudio profissionais\n' +
                          '• Interface amigável e responsiva\n\n' +
                          '**Clique no botão abaixo para adicionar o bot ao seu servidor!**')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com ❤️ por jvwp7', 
                iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('➕ Adicionar NEXUS MUSIC')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteUrl)
                    .setEmoji('🎵'),
                new ButtonBuilder()
                    .setLabel('🌐 Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://nexusmusic-bot.netlify.app')
                    .setEmoji('🌐'),
                new ButtonBuilder()
                    .setLabel('💬 Suporte')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/XVrXB37bRr')
                    .setEmoji('💬')
            );

        inter.editReply({ embeds: [embed], components: [row] });
    }
}; 