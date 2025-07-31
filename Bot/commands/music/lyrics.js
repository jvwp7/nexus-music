const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'letra',
    description: 'Obtenha a letra da música atual',
    voiceChannel: true,

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento <${inter.member}>... tente novamente! ❌`) });

        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e);
                return inter.editReply({ content: await Translate('Erro! Contate o desenvolvedor! ❌') });
            });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`Nenhuma letra encontrada para <${queue.currentTrack.title}>... tente novamente! ❌`) });

        const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

        const embed = new EmbedBuilder()
            .setTitle(await Translate(`Letra de <${queue.currentTrack.title}>`))
            .setAuthor({
                name: lyrics.artistName
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setFooter({ text: await Translate('Música em primeiro lugar!'), iconURL: inter.member.avatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('#2f3136');

        return inter.editReply({ embeds: [embed] });
    }
}

