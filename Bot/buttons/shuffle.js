const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });
    if (!queue.tracks.size) return inter.editReply({ content: await Translate(`Não há músicas na fila após a atual <${inter.member}>... tente novamente? <❌>`) });

    await queue.tracks.shuffle();

    const embed = new EmbedBuilder()
        .setColor('#1db954')
        .setAuthor({ 
            name: await Translate(`Fila embaralhada <${queue.tracks.size}> música(s)! <✅>`) 
        })
        .setDescription(
            `🔀 **Fila embaralhada com sucesso!**\n\n` +
            `📊 **${queue.tracks.size}** músicas foram reorganizadas\n` +
            `🎵 **Próxima música:** ${queue.tracks.at(0)?.title || 'N/A'}\n\n` +
            `🎮 **Controles:**\n` +
            `• Use \`n!fila\` para ver a nova ordem\n` +
            `• Use \`n!tocando\` para ver o que está tocando`
        )
        .setThumbnail('https://i.imgur.com/8tBXd6Q.gif')
        .setFooter({ 
            text: await Translate('🎵 NEXUS MUSIC • Feito com carinho por jvwp7'), 
            iconURL: inter.member.avatarURL({ dynamic: true }) 
        })
        .setTimestamp();

    return inter.editReply({ embeds: [embed] });
}