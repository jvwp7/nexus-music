const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'pular',
    description: 'Pular a música atual',
    voiceChannel: true,

    async execute({ inter }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        const embed = new EmbedBuilder().setColor('#2f3136');
        
        if (!queue?.isPlaying()) {
            embed.setTitle('❌ Nenhuma música tocando')
                .setDescription('Não há música tocando no momento.')
                .setColor('#ff6b6b')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
            return inter.editReply({ embeds: [embed] });
        }

        const success = queue.node.skip();
        if (success) {
            embed.setTitle('⏭️ Música pulada com sucesso!')
                .setDescription(
                    `🎵 **${queue.currentTrack.title}** foi pulada!\n\n` +
                    `👤 **Artista:** ${queue.currentTrack.author}\n` +
                    `🙋 **Solicitado por:** ${inter.member.user.username}\n\n` +
                    `🎮 **Próxima música:**\n` +
                    `• Use \`n!fila\` para ver a fila\n` +
                    `• Use \`n!tocando\` para ver o que está tocando`
                )
                .setThumbnail(queue.currentTrack.thumbnail)
                .setColor('#1db954')
                .setFooter({ 
                    text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                    iconURL: inter.member.avatarURL({ dynamic: true }) 
                })
                .setTimestamp();
        } else {
            embed.setTitle('❌ Erro ao pular música')
                .setDescription('Algo deu errado ao tentar pular a música. Tente novamente!')
                .setColor('#ff6b6b')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
        }
        return inter.editReply({ embeds: [embed] });
    }
}