const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pausar',
    description: 'Pausar a música atual',
    voiceChannel: true,

    async execute({ inter }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        
        if (!queue?.isPlaying()) return inter.editReply({ content: 'Nenhuma música está tocando no momento.' });

        if (queue.node.isPaused()) return inter.editReply({ content: 'A música já está pausada.' });

        const success = queue.node.setPaused(true);
        const pauseEmbed = new EmbedBuilder()
            .setAuthor({ 
                name: success ? `⏸️ Música pausada: ${queue.currentTrack.title} ✅` : '❌ Ocorreu um erro ao pausar a música.' 
            })
            .setDescription(
                success ? 
                `🎵 **${queue.currentTrack.title}** foi pausada!\n\n` +
                `👤 **Artista:** ${queue.currentTrack.author}\n` +
                `🙋 **Solicitado por:** ${inter.member.user.username}\n\n` +
                `🎮 **Controles:**\n` +
                `• Use \`n!retomar\` para continuar\n` +
                `• Use \`n!pular\` para pular a música` :
                'Não foi possível pausar a música. Tente novamente!'
            )
            .setThumbnail(success ? queue.currentTrack.thumbnail : 'https://i.imgur.com/8tBXd6Q.gif')
            .setColor(success ? '#1db954' : '#ff6b6b')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        return inter.editReply({ embeds: [pauseEmbed] });
    }
}