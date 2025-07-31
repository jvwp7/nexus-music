const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

const maxVol = client.config.opt.maxVol;

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    const vol = Math.floor(queue.node.volume + 5)
    if (vol > maxVol) return inter.editReply({ content: await Translate(`Não posso aumentar mais o volume <${inter.member}>... tente novamente? <❌>`) });
    if (queue.node.volume === vol) return inter.editReply({ content: await Translate(`O volume que você quer alterar já é o atual <${inter.member}>... tente novamente? <❌>`) });

    const success = queue.node.setVolume(vol);

    if (success) {
        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('🔊 Volume aumentado!')
            .setDescription(
                `🎵 **Volume ajustado para ${vol}/${maxVol}%**\n\n` +
                `👤 **Solicitado por:** ${inter.member.user.username}\n` +
                `🎧 **Canal:** ${inter.member.voice.channel.name}\n\n` +
                `🎮 **Controles:**\n` +
                `• Use \`n!volume ${vol}\` para definir volume específico\n` +
                `• Use \`n!tocando\` para ver informações da música`
            )
            .setThumbnail(queue.currentTrack.thumbnail)
            .setFooter({ 
                text: await Translate('🎵 NEXUS MUSIC • Feito com carinho por jvwp7'), 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();
        
        return inter.editReply({ embeds: [embed] });
    } else {
        return inter.editReply({ content: await Translate(`Algo deu errado <${inter.member}>... tente novamente? <❌>`) });
    }
}