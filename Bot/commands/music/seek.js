const ms = require('ms');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'procurar',
    description: 'Ir para frente ou para trás em uma música',
    voiceChannel: true,
    options: [
        {
            name: 'tempo',
            description: 'O tempo para pular para',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.editReply}>... try again ? <❌>`) });

        const timeToMS = ms(inter.options.getString('tempo'));
        if (timeToMS >= queue.currentTrack.durationMS) {
            return inter.editReply({ content: await Translate(`The indicated time is higher than the total time of the current song <${inter.member}>... try again ? <❌\n> *Try for example a valid time like <**5s, 10s, 20 seconds, 1m**>...*`) });
        }

        await queue.node.seek(timeToMS);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Time set on the current song <**${ms(timeToMS, { long: true })}**> <✅>`) });

        inter.editReply({ embeds: [embed] });
    }
}