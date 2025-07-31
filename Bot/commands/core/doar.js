const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'doar',
    description: 'Faça uma doação para apoiar o desenvolvimento do bot!',
    showHelp: true,

    async execute({ client, inter }) {
        const embed = new EmbedBuilder()
            .setColor('#1db954')
            .setTitle('💚 Apoie o NEXUS MUSIC!')
            .setDescription(
                '**Obrigado por considerar fazer uma doação!**\n\n' +
                'Sua doação ajuda a manter o bot funcionando e a desenvolver novas funcionalidades!'
            )
            .addFields([
                {
                    name: '🎵 O que sua doação apoia',
                    value: '• Manutenção dos servidores\n• Desenvolvimento de novas features\n• Melhorias na qualidade do áudio\n• Suporte técnico 24/7',
                    inline: false
                },
                {
                    name: '💳 Chave PIX',
                    value: '```\nsuporte.nexusmusic@gmail.com\n```',
                    inline: false
                },
                {
                    name: '📱 Como doar',
                    value: '1. Abra seu app bancário\n2. Escolha "PIX" ou "Pagar"\n3. Digite a chave: `suporte.nexusmusic@gmail.com`\n4. Escolha o valor da doação\n5. Confirme o pagamento',
                    inline: false
                },
                {
                    name: '🎁 Benefícios para doadores',
                    value: '• Acesso prioritário a novas funcionalidades\n• Suporte VIP no Discord\n• Agradecimento especial no servidor\n• Status exclusivo de "Apoiador"',
                    inline: false
                },
                {
                    name: '💝 Qualquer valor é bem-vindo!',
                    value: 'Desde R$ 1,00 até qualquer valor que você puder doar.',
                    inline: false
                },
                {
                    name: '📞 Precisa de ajuda?',
                    value: 'Entre em contato: `suporte.nexusmusic@gmail.com`',
                    inline: false
                }
            ])
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setImage('https://i.imgur.com/8tBXd6Q.gif')
            .setFooter({ 
                text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                iconURL: inter.member.avatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await inter.editReply({ 
            embeds: [embed]
        });
    }
}; 