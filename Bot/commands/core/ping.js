const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Mostra o ping do bot.',
    showHelp: true,

    async execute({ client, inter }) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(`🏓 Pong! Latência: \`${client.ws.ping}ms\``);
        inter.editReply({ embeds: [embed] });
    }
};