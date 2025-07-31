const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(`Nenhuma música tocando no momento... tente novamente? <❌>`),
    });
  if (!queue.history.previousTrack)
    return inter.editReply({
      content: await Translate(`Não havia música tocando antes <${inter.member}>... tente novamente? <❌>`),
    });

  await queue.history.back();

  inter.editReply({
    content: await Translate(`Tocando a música <**anterior**> <✅>`),
  });
};
