const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'fila',
    description: 'Veja as músicas na fila',
    voiceChannel: true,

    async execute({ client, inter }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        const embed = new EmbedBuilder().setColor('#a259ff'); // Roxo vibrante

        if (!queue) {
            embed.setTitle('❌ Nenhuma música tocando')
                .setDescription('Não há música tocando no momento.')
                .setColor('#ff6b6b')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
            return inter.editReply({ embeds: [embed] });
        }
        if (!queue.tracks.size) {
            embed.setTitle('⚠️ Fila vazia')
                .setDescription('Não há músicas na fila após a atual.')
                .setColor('#ffb300')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
            return inter.editReply({ embeds: [embed] });
        }

        const methods = ['', '🔁', '🔂'];
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? `E mais **${songs - 5}** música(s)...` : `Na playlist: **${songs}** música(s)`;
        
        // Limitar o número de tracks para evitar texto muito longo
        const tracksToShow = queue.tracks.slice(0, 5);
        const tracks = tracksToShow.map((track, i) => {
            let user = track.requestedBy;
            if (user && typeof user === 'object') {
                user = user.displayName || user.username || user.tag || 'desconhecido';
            } else if (!user) {
                user = 'desconhecido';
            }
            return `**${i + 1}.** 🎵 ${track.title}\n👤 ${track.author} • 🙋 ${user}`;
        });
        
        embed.setTitle('📜 Fila de Reprodução')
            .setAuthor({ 
                name: `🎵 ${inter.guild.name} ${methods[queue.repeatMode]}`, 
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) 
            })
            .setThumbnail(queue.currentTrack.thumbnail)
            .addFields([
                {
                    name: '🎶 Tocando agora',
                    value: `**${queue.currentTrack.title}**\n👤 ${queue.currentTrack.author}\n⏱️ ${queue.currentTrack.duration}\n🔊 Volume: ${queue.node.volume}%`,
                    inline: false
                },
                {
                    name: '📋 Próximas músicas',
                    value: tracks.length > 0 ? tracks.join('\n\n') : 'Nenhuma música na fila',
                    inline: false
                }
            ])
            .setTimestamp()
            .setFooter({ 
                text: `🎵 NEXUS MUSIC • ${nextSongs}`, 
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) 
            });

        inter.editReply({ embeds: [embed] });
    }
}