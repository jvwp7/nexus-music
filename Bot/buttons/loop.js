const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const methods = ['desativado', 'música', 'fila'];
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    if (queue.repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)
    else queue.setRepeatMode(queue.repeatMode + 1)

    return inter.editReply({ content: await Translate(`Loop foi definido como <**${methods[queue.repeatMode]}**>.<✅>`) });
}