const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });
    if (!queue.tracks.size) return inter.editReply({ content: await Translate(`Não há músicas na fila após a atual <${inter.member}>... tente novamente? <❌>`) });

    const methods = ['', '🔁', '🔂'];
    const songs = queue.tracks.size;
    const nextSongs = songs > 5 ? await Translate(`E mais <**${songs - 5}**> música(s)...`) : await Translate(`Na playlist <**${songs}**> música(s)...`);
    const tracks = queue.tracks.map(async (track, i) => await Translate(`<**${i + 1}**> - <${track.title} | ${track.author}> (solicitado por: <${track.requestedBy ? track.requestedBy.displayName : "desconhecido"}>)`));

    const embed = new EmbedBuilder()
        .setColor('#a259ff')
        .setThumbnail(queue.currentTrack.thumbnail)
        .setAuthor({ 
            name: await Translate(`Fila do servidor - <${inter.guild.name} ${methods[queue.repeatMode]}>`), 
            iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) 
        })
        .setDescription(
            `🎶 **Tocando agora:** ${queue.currentTrack.title}\n` +
            `👤 **Artista:** ${queue.currentTrack.author}\n` +
            `⏱️ **Duração:** ${queue.currentTrack.duration}\n` +
            `🔊 **Volume:** ${queue.node.volume}%\n` +
            `──────────────────────────────\n` +
            `${tracks.slice(0, 5).join('\n──────────────────────────────\n')}\n` +
            `──────────────────────────────\n${nextSongs}`
        )
        .setTimestamp()
        .setFooter({ 
            text: await Translate('🎵 NEXUS MUSIC • Feito com carinho por jvwp7 <❤️>'), 
            iconURL: inter.member.avatarURL({ dynamic: true }) 
        });

    inter.editReply({ embeds: [embed] });
}
