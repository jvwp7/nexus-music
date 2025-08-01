const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'proximamusica',
    description: 'Tocar uma música logo após esta',
    voiceChannel: true,
    options: [
        {
            name: 'musica',
            description: 'A música que você quer tocar em seguida',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);

        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const song = inter.options.getString('musica');
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`No results found <${inter.member}>... try again ? <❌>`) });

        if (res.playlist) return inter.editReply({ content: await Translate(`This command dose not support playlist's <${inter.member}>... try again ? <❌>`) });

        queue.insertTrack(res.tracks[0], 0);

        const playNextEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Track has been inserted into the queue... it will play next <🎧>`) })
            .setColor('#2f3136');

        await inter.editReply({ embeds: [playNextEmbed] });
    }
}
