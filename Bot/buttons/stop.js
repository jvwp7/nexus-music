const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    queue.delete();

    const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: await Translate(`Música parada neste servidor, até a próxima <✅>`) });

    return inter.editReply({ embeds: [embed] });
}