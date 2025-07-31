const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { Translate } = require("../../process_tools");

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  (async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Começou a tocar <${track.title}> em <${queue.channel.name}> <🎧>`
        ),
        iconURL: track.thumbnail,
      })
      .setColor("#1db954");

    // Botões com emojis padrão para evitar erros
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
      .setCustomId("lyrics")
      .setStyle("Secondary");

    const row1 = new ActionRowBuilder().addComponents(
      back,
      resumepause,
      skip
    );

    const row2 = new ActionRowBuilder().addComponents(
      loop,
      lyrics
    );

    try {
      await queue.metadata.channel.send({ embeds: [embed], components: [row1, row2] });
    } catch (error) {
      console.error('Erro ao enviar botões:', error);
      // Fallback: enviar apenas o embed sem botões
      await queue.metadata.channel.send({ embeds: [embed] });
    }
  })();
};
