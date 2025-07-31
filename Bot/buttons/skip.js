const { Translate } = require("../process_tools");

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`) });

    const success = queue.node.skip();

    return inter.editReply({ content: success ? await Translate(`Música atual <${queue.currentTrack.title}> pulada <✅>`) : await Translate(`Algo deu errado <${inter.member}>... tente novamente? <❌>`) });
}