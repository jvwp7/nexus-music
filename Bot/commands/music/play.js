const { QueryType } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');
const fetch = require('node-fetch');

module.exports = {
    name: 'tocar',
    description: 'Toque uma música!',
    voiceChannel: true,
    options: [
        {
            name: 'musica',
            description: 'A música que você quer tocar ou link da playlist do Spotify',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter, client }) {
        const player = global.player;
        const musica = inter.options.getString('musica');
        let defaultEmbed = new EmbedBuilder().setColor('#1db954');

        // Verificar se a música não está vazia
        if (!musica || musica.trim() === '') {
            defaultEmbed.setTitle('❌ Nenhuma música especificada')
                .setDescription('Por favor, especifique uma música para tocar.\nExemplo: `n!tocar despacito`')
                .setColor('#ff6b6b');
            return inter.editReply({ embeds: [defaultEmbed] });
        }

        // Verificar se o usuário está em um canal de voz
        if (!inter.member.voice.channel) {
            defaultEmbed.setTitle('❌ Você não está em um canal de voz')
                .setDescription('Entre em um canal de voz primeiro!')
                .setColor('#ff6b6b');
            return inter.editReply({ embeds: [defaultEmbed] });
        }

        try {
            // Detecta se é link de playlist do Spotify
            if (/open\.spotify\.com\/playlist\//.test(musica)) {
                try {
                    console.log('Buscando playlist do Spotify:', musica);
                    const res = await player.search(musica, {
                        requestedBy: inter.member,
                        searchEngine: QueryType.SPOTIFY_PLAYLIST
                    });
                    
                    if (!res?.tracks.length) {
                        console.log('Nenhuma faixa encontrada na playlist do Spotify.');
                        defaultEmbed.setTitle('❌ Nenhum resultado encontrado')
                            .setDescription('Não foi possível encontrar músicas nesta playlist do Spotify.')
                            .setColor('#ff6b6b');
                        return inter.editReply({ embeds: [defaultEmbed] });
                    }
                    
                    let adicionadas = 0;
                    let falhas = [];
                    
                    for (const track of res.tracks) {
                        console.log('Buscando no YouTube:', `${track.title} ${track.author || ''}`);
                        const ytRes = await player.search(`${track.title} ${track.author || ''}`, {
                            requestedBy: inter.member,
                            searchEngine: QueryType.YOUTUBE_SEARCH
                        });
                        
                        if (ytRes && ytRes.tracks && ytRes.tracks[0]) {
                            try {
                                console.log('Tocando:', ytRes.tracks[0].title);
                                await player.play(inter.member.voice.channel, ytRes.tracks[0], {
                                    nodeOptions: {
                                        metadata: { channel: inter.channel },
                                        volume: 75,
                                        leaveOnEmpty: true,
                                        leaveOnEmptyCooldown: 30000,
                                        leaveOnEnd: true,
                                        leaveOnEndCooldown: 30000,
                                    }
                                });
                                adicionadas++;
                                
                                // Incrementar contador de músicas
                                if (global.botStats) {
                                    global.botStats.incrementSongsPlayed();
                                }
                            } catch (err) {
                                console.error('Erro ao tocar faixa:', track.title, err);
                                falhas.push(track.title);
                            }
                        } else {
                            console.log('Não encontrou no YouTube:', track.title);
                            falhas.push(track.title);
                        }
                    }
                    
                    let desc = `🎵 **Playlist adicionada com sucesso!**\n\n` +
                              `📊 **${adicionadas}** músicas foram adicionadas à fila\n` +
                              `🎧 **Canal:** ${inter.member.voice.channel.name}\n` +
                              `👤 **Solicitado por:** ${inter.member.user.username}`;
                    
                    if (falhas.length > 0) {
                        desc += `\n\n❌ **Músicas não encontradas:**\n${falhas.map(t => `• ${t}`).join('\n')}`;
                    }
                    
                    defaultEmbed.setTitle('🎶 Playlist do Spotify Adicionada!')
                        .setDescription(desc)
                        .setColor('#1db954')
                        .setThumbnail('https://i.imgur.com/8tBXd6Q.gif')
                        .setFooter({ 
                            text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                            iconURL: inter.member.avatarURL({ dynamic: true }) 
                        })
                        .setTimestamp();
                    
                    return inter.editReply({ embeds: [defaultEmbed] });
                    
                } catch (error) {
                    console.error('Erro ao processar playlist do Spotify:', error);
                    defaultEmbed.setTitle('❌ Erro ao processar playlist')
                        .setDescription('Ocorreu um erro ao processar a playlist do Spotify.')
                        .setColor('#ff6b6b');
                    return inter.editReply({ embeds: [defaultEmbed] });
                }
            }

            // Buscar música normal
            console.log('Buscando música:', musica);
            
            // Buscar música normal
            console.log('Buscando música:', musica);
            
            // Buscar música normal
            console.log('Buscando música:', musica);
            const res = await player.search(musica, {
                requestedBy: inter.member,
                searchEngine: QueryType.AUTO
            });

            if (!res || !res.tracks.length) {
                console.log('Nenhum resultado encontrado para:', musica);
                defaultEmbed.setTitle('❌ Nenhum resultado encontrado')
                    .setDescription(`Não foi possível encontrar músicas para: **${musica}**\nTente com outro nome ou link.`)
                    .setColor('#ff6b6b');
                return inter.editReply({ embeds: [defaultEmbed] });
            }

            const track = res.tracks[0];
            console.log('Tocando música:', track.title);

            // Tentar tocar a música
            try {
                await player.play(inter.member.voice.channel, track, {
                    nodeOptions: {
                        metadata: { channel: inter.channel },
                        volume: 75,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 30000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 30000,
                    }
                });

                // Incrementar contador de músicas
                if (global.botStats) {
                    global.botStats.incrementSongsPlayed();
                }

                defaultEmbed.setTitle('🎵 Música Iniciada!')
                    .setDescription(`**${track.title}**\n\n👤 **Artista:** ${track.author}\n⏱️ **Duração:** ${track.duration}\n🎧 **Canal:** ${inter.member.voice.channel.name}\n👤 **Solicitado por:** ${inter.member.user.username}`)
                    .setColor('#1db954')
                    .setThumbnail(track.thumbnail || 'https://i.imgur.com/8tBXd6Q.gif')
                    .setFooter({ 
                        text: '🎵 NEXUS MUSIC • Feito com carinho por jvwp7', 
                        iconURL: inter.member.avatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();

                return inter.editReply({ embeds: [defaultEmbed] });

            } catch (error) {
                console.error('Erro ao tocar música:', error);
                defaultEmbed.setTitle('❌ Erro ao tocar música')
                    .setDescription('Ocorreu um erro ao tentar tocar a música. Verifique se o FFmpeg está instalado.')
                    .setColor('#ff6b6b');
                return inter.editReply({ embeds: [defaultEmbed] });
            }

        } catch (error) {
            console.error('Erro geral no comando tocar:', error);
            defaultEmbed.setTitle('❌ Erro inesperado')
                .setDescription('Ocorreu um erro inesperado. Tente novamente.')
                .setColor('#ff6b6b');
            return inter.editReply({ embeds: [defaultEmbed] });
        }
    }
};
