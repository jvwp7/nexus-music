const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'retomar',
    description: 'Retomar a música pausada',
    voiceChannel: true,

    async execute({ inter }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        
        if (!queue) return inter.editReply({ content: 'Nenhuma música está tocando no momento.' });

        if (queue.node.isPlaying()) return inter.editReply({ content: 'A música já está tocando.' });

        const success = queue.node.resume();

        const resumeEmbed = new EmbedBuilder()
            .setAuthor({ 
                name: success ? `▶️ Música retomada: ${queue.currentTrack.title} ✅` : '❌ Ocorreu um erro ao retomar a música.' 
            })
            .setDescription(
                success ? 
                `🎵 **${queue.currentTrack.title}** foi retomada!\n\n` +
                `👤 **Artista:** ${queue.currentTrack.author}\n` +
                `🙋 **Solicitado por:** ${inter.member.user.username}\n\n` +
                `🎮 **Controles:**\n` +
                `• Use \`n!pausar\` para pausar\n` +
                `• Use \`n!pular\` para pular a música` :
                'Não foi possível retomar a música. Tente novamente!'
            )
            .setThumbnail(success ? queue.currentTrack.thumbnail : 'https://i.imgur.com/8tBXd6Q.gif')
            .setColor(success ? '#1db954' : '#ff6b6b')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        return inter.editReply({ embeds: [resumeEmbed] });
    }
}
