const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    name: 'controller',
    description: 'Enviar o painel de controle de música para um canal',
    voiceChannel: false,
    permissions: PermissionsBitField.Flags.ManageMessages,
    options: [
        {
            name: 'channel',
            description: 'O canal de texto para enviar o painel',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    async execute({ inter }) {
        const channel = inter.options.getChannel('channel');
        if (channel.type !== ChannelType.GuildText) return inter.editReply({ content: 'Você precisa enviar para um canal de texto. ❌' });

        const embed = new EmbedBuilder()
            .setTitle('🎛️ Painel de Controle de Música')
            .setDescription('Use os botões abaixo para controlar a música no servidor!')
            .setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
            .setColor('#5865F2')
            .setFooter({ text: 'Música em primeiro lugar!', iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ content: `🎶 Painel enviado para ${channel}!`, embeds: [embed] });

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

        const save = new ButtonBuilder()
            .setLabel('💾 Salvar')
            .setCustomId('savetrack')
            .setStyle('Secondary');

        const volumeup = new ButtonBuilder()
            .setLabel('🔊 Aumentar')
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel('🔉 Diminuir')
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel('🔁 Loop')
            .setCustomId('loop')
            .setStyle('Secondary');

        const np = new ButtonBuilder()
            .setLabel('🎵 Tocando Agora')
            .setCustomId('nowplaying')
            .setStyle('Secondary');

        const queuebutton = new ButtonBuilder()
            .setLabel('📜 Fila')
            .setCustomId('queue')
            .setStyle('Secondary');

        const lyrics = new ButtonBuilder()
            .setLabel('📝 Letra')
            .setCustomId('Lyrics')
            .setStyle('Secondary');

        const shuffle = new ButtonBuilder()
            .setLabel('🔀 Aleatório')
            .setCustomId('shuffle')
            .setStyle('Secondary');

        const stop = new ButtonBuilder()
            .setLabel('⏹️ Parar')
            .setCustomId('stop')
            .setStyle('Danger');

        const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip, stop, save);
        const row2 = new ActionRowBuilder().addComponents(volumedown, volumeup, loop);
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, queuebutton, np);

        try {
            await channel.send({ embeds: [embed], components: [row1, row2, row3] });
        } catch (error) {
            console.error('Erro ao enviar painel de controle:', error);
            await channel.send({ embeds: [embed] });
        }
    }
}
