const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ajuda',
    description: 'Veja todos os comandos disponíveis',
    showHelp: true,

    async execute({ client, inter }) {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('🎵 NEXUS MUSIC - Comandos')
            .setDescription(
                'Veja abaixo todos os comandos disponíveis em português!\n' +
                '──────────────────────────────\n' +
                '💡 **Exemplos rápidos:**\n' +
                '• `n!ajuda` — Mostra esta mensagem de ajuda\n' +
                '• `n!adicionar` — Receba o link para me adicionar em outro servidor\n' +
                '• `n!doar` — Apoie o desenvolvimento do bot\n' +
                '• `n!status` — Veja informações do sistema\n' +
                '• Feito com carinho por jvwp7\n' +
                '──────────────────────────────\n' +
                '🎵 **Dicas de música:**\n' +
                '• Use `n!tocar nome da música` para tocar qualquer música do YouTube.\n' +
                '• Use `n!fila` para ver a lista de músicas.\n' +
                '• Use `n!letra` para ver a letra da música atual.\n' +
                '• Você pode controlar o volume com `n!volume`.\n' +
                '• Experimente comandos como `n!pular`, `n!parar`, `n!salvar`, `n!pausar`, `n!retomar` e mais!')
            .addFields([
                {
                    name: `🟢 Comandos Principais - ${commands.size}`,
                    value: '🔹 **adicionar**: Receba o link para adicionar o bot\n🔹 **ajuda**: Veja todos os comandos disponíveis\n🔹 **doar**: Faça uma doação para apoiar o desenvolvimento\n🔹 **ping**: Mostra o ping do bot\n🔹 **status**: Veja o status do bot e informações do sistema'
                },
                {
                    name: '🎵 Comandos de Música',
                    value: '🔹 **tocar**: Toque uma música!\n🔹 **pausar**: Pausar a música atual\n🔹 **retomar**: Retomar a música pausada\n🔹 **pular**: Pular a música atual\n🔹 **parar**: Parar a música e limpar a fila\n🔹 **volume**: Ajuste o volume\n🔹 **tocando**: Veja qual música está tocando agora!'
                },
                {
                    name: '📋 Comandos de Fila',
                    value: '🔹 **fila**: Veja as músicas na fila\n🔹 **limpar**: Limpar todas as músicas da fila\n🔹 **remover**: Remover uma música da fila\n🔹 **embaralhar**: Embaralhar a fila\n🔹 **proximamusica**: Tocar uma música logo após esta\n🔹 **voltar**: Voltar para a última música tocada'
                },
                {
                    name: '🎛️ Comandos Avançados',
                    value: '🔹 **buscar**: Busque uma música\n🔹 **salvar**: Salvar a música atual!\n🔹 **letra**: Obtenha a letra da música atual\n🔹 **repetir**: Alternar a repetição de músicas\n🔹 **procurar**: Ir para frente ou para trás em uma música\n🔹 **filtro**: Adicionar um filtro à sua música'
                }
            ])
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setImage('https://i.imgur.com/8tBXd6Q.gif')
            .setTimestamp()
            .setFooter({
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7 • Use n!doar para apoiar!',
                iconURL: inter.member.avatarURL({ dynamic: true })
            });

        await inter.editReply({ embeds: [embed] });
    }
}; 