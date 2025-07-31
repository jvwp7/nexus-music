const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    const embed = new EmbedBuilder()
        .setColor('#1db954')
        .setTitle(`🎵 ${queue.currentTrack.title}`)
        .setURL(queue.currentTrack.url)
        .setDescription(
            `🎶 **${queue.currentTrack.title}**\n\n` +
            `👤 **Artista:** ${queue.currentTrack.author}\n` +
            `⏱️ **Duração:** ${queue.currentTrack.duration}\n` +
            `👁️ **Visualizações:** ${Number(queue.currentTrack.views).toLocaleString()}\n` +
            `🔗 **URL:** ${queue.currentTrack.url}\n\n` +
            `💾 **Música salva com sucesso!**`
        )
        .setThumbnail(queue.currentTrack.thumbnail)
        .setFooter({ 
            text: await Translate(`Do servidor ${inter.member.guild.name}`), 
            iconURL: inter.member.guild.iconURL({ dynamic: false }) 
        })
        .setTimestamp();

    inter.member.send({ embeds: [embed] })
        .then(async () => {
            return inter.editReply({ content: await Translate(`Enviei o título da música por mensagem privada <✅>`) });
        }).catch(async (error) => {
            console.error(error);
            return inter.editReply({ content: await Translate(`Não foi possível enviar mensagem privada... tente novamente? <❌>`) });
        });
}
