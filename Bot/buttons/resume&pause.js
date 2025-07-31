const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    const resumed = queue.node.resume();
    let message = await Translate(`Música atual <${queue.currentTrack.title}> retomada <✅>`);

    if (!resumed) {
        queue.node.pause();
        message = await Translate(`Música atual <${queue.currentTrack.title}> pausada <✅>`);
    }

    return inter.editReply({ content: message });
}