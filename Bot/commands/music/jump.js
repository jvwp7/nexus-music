const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'pularpara',
    description: 'Pular para uma música específica na fila usando Jump',
    voiceChannel: true,
    options: [
        {
            name: 'musica',
            description: 'O nome/URL da música que você quer pular para',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'numero',
            description: 'A posição da música na fila',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = inter.options.getString('musica');
        const number = inter.options.getNumber('numero');
        if (!track && !number) inter.editReply({ content: await Translate(`You have to use one of the options to jump to a song <${inter.member}>... try again ? <❌>`) });

        let trackName;
        if (track) {
            const toJump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            if (!toJump) return inter.editReply({ content: await Translate(`could not find <${track}> <${inter.member}>... try using the url or the full name of the song ? <❌>`) });

            queue.node.jump(toJump);
            trackName = toJump.title;
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`This track does not seem to exist <${inter.member}>...  try again ? <❌>`) });

            queue.node.jump(index);
            trackName = name;
        }

        const jumpEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Jumped to <${trackName}> <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [jumpEmbed] });
    }
}
