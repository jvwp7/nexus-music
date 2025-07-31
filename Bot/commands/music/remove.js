const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'remover',
    description: 'Remover uma música da fila',
    voiceChannel: true,
    options: [
        {
            name: 'musica',
            description: 'O nome/URL da música que você quer remover',
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

        const number = inter.options.getNumber('numero');
        const track = inter.options.getString('musica');
        if (!track && !number) inter.editReply({ content: await Translate(`You have to use one of the options to remove a song <${inter.member}>... try again ? <❌>`) });

        let trackName;

        if (track) {
            const toRemove = queue.tracks.toArray().find((t) => t.title === track || t.url === track);
            if (!toRemove) return inter.editReply({ content: await Translate(`could not find <${track}> <${inter.member}>... try using the url or the full name of the song ? <❌>`) });

            queue.removeTrack(toRemove);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`This track does not seem to exist <${inter.member}>...  try again ? <❌>`) });

            queue.removeTrack(index);

            trackName = name;
        }
        
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Removed <${trackName}> from the queue <✅>`) });

        return inter.editReply({ embeds: [embed] });
    }
}
