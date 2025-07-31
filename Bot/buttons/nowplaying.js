const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = async ({ client, inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: 'Nenhuma música está tocando no momento.' });

    const track = queue.currentTrack;
    const repeatModes = ['Desativado', 'Repetir Música', 'Repetir Fila'];
    const trackDuration = track.duration === 'Infinity' ? 'ao vivo' : track.duration;
    const progress = queue.node.createProgressBar();

    const embed = new EmbedBuilder()
        .setColor('#1db954')
        .setTitle(`🎵 Tocando Agora`)
        .setThumbnail(track.thumbnail)
        .setDescription(
            `**${track.title}**\n` +
            `> 👤 **Artista:** ${track.author}\n` +
            `> 🙋 **Pedido por:** ${track.requestedBy ? track.requestedBy : 'desconhecido'}\n` +
            `> ⏱️ **Duração:** ${trackDuration}\n` +
            `> 🔊 **Volume:** ${queue.node.volume}%\n` +
            `> 🔁 **Repetição:** ${repeatModes[queue.repeatMode]}\n` +
            `\n${progress}`
        )
        .setFooter({ text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setTimestamp();

    // Botões com emojis padrão
    const back = new ButtonBuilder()
        .setLabel('⏪ Voltar')
        .setCustomId('back')
        .setStyle('Primary');

    const skip = new ButtonBuilder()
        .setLabel('⏩ Pular')
        .setCustomId('skip')
        .setStyle('Primary');

    const resumepause = new ButtonBuilder()
        .setLabel('⏯️ Pausar/Retomar')
        .setCustomId('resume&pause')
        .setStyle('Success');

    const loop = new ButtonBuilder()
        .setLabel('🔁 Loop')
        .setCustomId('loop')
        .setStyle('Secondary');

    const lyrics = new ButtonBuilder()
        .setLabel('📝 Letra da música')
        .setCustomId('lyrics')
        .setStyle('Secondary');

    // Linha 1: Voltar, Pausar/Retomar, Pular
    const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip);
    // Linha 2: Loop, Letra da música
    const row2 = new ActionRowBuilder().addComponents(loop, lyrics);

    try {
        await inter.editReply({ embeds: [embed], components: [row1, row2] });
    } catch (error) {
        console.error('Erro ao enviar botões do nowplaying:', error);
        // Fallback: enviar apenas o embed sem botões
        await inter.editReply({ embeds: [embed] });
    }
}
