const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'tocando',
    description: 'Veja qual música está tocando agora!',
    voiceChannel: true,

    async execute({ inter, client }) {
        const player = global.player;
        const queue = player.nodes.get(inter.guild);
        
        if (!queue?.isPlaying()) return inter.editReply({ content: 'Nenhuma música está tocando no momento.' });

        const track = queue.currentTrack;
        const repeatModes = ['Desativado', 'Repetir Música', 'Repetir Fila'];
        const trackDuration = track.duration === 'Infinity' ? 'ao vivo' : track.duration;
        const progress = queue.node.createProgressBar();

        let EmojiState = client.config.app.enableEmojis;
        const emojis = client.config?.emojis;
        emojis ? EmojiState = EmojiState : EmojiState = false;

        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: `🎵 Tocando Agora`, 
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) 
            })
            .setThumbnail(track.thumbnail)
            .setDescription(
                `🎶 **${track.title}**\n\n` +
                `👤 **Artista:** ${track.author}\n` +
                `⏱️ **Duração:** ${trackDuration}\n` +
                `🔊 **Volume:** ${queue.node.volume}%\n` +
                `🔁 **Modo de repetição:** ${repeatModes[queue.repeatMode]}\n` +
                `🙋 **Pedido por:** ${track.requestedBy ? track.requestedBy : 'desconhecido'}\n\n` +
                `⏩ **Progresso:**\n${progress}`
            )
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setColor('#1db954')
            .setTimestamp();
        
        const saveButton = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : '💾 Salvar')
            .setCustomId('savetrack')
            .setStyle('Danger');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : '🔊 Aumentar')
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : '🔉 Diminuir')
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : '🔁 Loop')
            .setCustomId('loop')
            .setStyle('Danger');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : '⏯️ Pausar/Retomar')
            .setCustomId('resume&pause')
            .setStyle('Success');

        const row = new ActionRowBuilder().addComponents(volumedown, resumepause, volumeup, loop, saveButton);
        inter.editReply({ embeds: [embed], components: [row] });
    }
}
