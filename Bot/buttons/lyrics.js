const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const player = global.player;
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento <${inter.member}>... tente novamente? <❌>`) });

    const results = await player.lyrics
        .search({
            q: queue.currentTrack.title
        })
        .catch(async (e) => {
            console.log(e);
            return inter.editReply({ content: await Translate(`Erro! Entre em contato com os desenvolvedores! | <❌>`) });
        });

    const lyrics = results?.[0];
    if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`Nenhuma letra encontrada para <${queue.currentTrack.title}>... tente novamente? <❌>`) });

    const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
        .setTitle(`📝 Letra de ${queue.currentTrack.title}`)
        .setAuthor({
            name: lyrics.artistName,
            iconURL: queue.currentTrack.thumbnail
        })
        .setDescription(
            `🎶 **${queue.currentTrack.title}**\n` +
            `👤 **Artista:** ${lyrics.artistName}\n` +
            `⏱️ **Duração:** ${queue.currentTrack.duration}\n\n` +
            `📝 **Letra:**\n${trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics}`
        )
        .setThumbnail(queue.currentTrack.thumbnail)
        .setFooter({ 
            text: await Translate('🎵 NEXUS MUSIC • Feito com carinho por jvwp7 <❤️>'), 
            iconURL: inter.member.avatarURL({ dynamic: true }) 
        })
        .setTimestamp()
        .setColor('#1db954');

    return inter.editReply({ embeds: [embed] });
}