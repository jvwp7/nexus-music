const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'parar',
    description: 'Parar a música e limpar a fila',
    voiceChannel: true,

    async execute({ inter }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        
        if (!queue?.isPlaying()) return inter.editReply({ content: 'Nenhuma música está tocando no momento.' });

        queue.delete();

        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setAuthor({ 
                name: '⏹️ Música parada e fila limpa! Até a próxima! ✅' 
            })
            .setDescription(
                `🎵 **Reprodução interrompida!**\n\n` +
                `👤 **Solicitado por:** ${inter.member.user.username}\n` +
                `🎧 **Canal:** ${inter.member.voice.channel.name}\n\n` +
                `🎮 **Para tocar novamente:**\n` +
                `• Use \`n!tocar nome da música\`\n` +
                `• Use \`n!ajuda\` para ver todos os comandos`
            )
            .setThumbnail('https://i.imgur.com/8tBXd6Q.gif')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        return inter.editReply({ embeds: [embed] });
    }
}