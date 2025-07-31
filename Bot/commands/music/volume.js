const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');
const maxVol = 100;

module.exports = {
    name: 'volume',
    description: 'Ajuste o volume',
    voiceChannel: true,
    options: [
        {
            name: 'valor',
            description: 'O novo volume',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: maxVol
        }
    ],

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

        const vol = inter.options.getNumber('valor');
        if (queue.node.volume === vol) {
            embed.setTitle('⚠️ Volume já definido')
                .setDescription(`O volume já está em **${vol}%**.`)
                .setColor('#ffb300')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
            return inter.editReply({ embeds: [embed] });
        }

        const success = queue.node.setVolume(vol);
        if (success) {
            embed.setTitle('🔊 Volume alterado com sucesso!')
                .setDescription(
                    `🎵 **Volume ajustado para ${vol}%**\n\n` +
                    `👤 **Solicitado por:** ${inter.member.user.username}\n` +
                    `🎧 **Canal:** ${inter.member.voice.channel.name}\n\n` +
                    `🎮 **Controles:**\n` +
                    `• Use \`n!volume 50\` para definir volume\n` +
                    `• Use \`n!tocando\` para ver informações da música`
                )
                .setThumbnail(queue.currentTrack.thumbnail)
                .setColor('#1db954')
                .setFooter({ 
                    text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                    iconURL: inter.member.avatarURL({ dynamic: true }) 
                })
                .setTimestamp();
        } else {
            embed.setTitle('❌ Erro ao alterar o volume')
                .setDescription('Algo deu errado ao tentar alterar o volume. Tente novamente!')
                .setColor('#ff6b6b')
                .setThumbnail('https://i.imgur.com/8tBXd6Q.gif');
        }
        return inter.editReply({ embeds: [embed] });
    }
}