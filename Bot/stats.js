const fs = require('fs');
const path = require('path');

class BotStats {
    constructor() {
        this.statsFile = path.join(__dirname, 'bot-stats.json');
        this.stats = this.loadStats();
        this.totalSongsPlayed = 0;
        this.startTime = Date.now();
        this.realTimeSongs = [];
        this.activeServers = new Set();
        this.activeUsers = new Set();
    }

    loadStats() {
        try {
            if (fs.existsSync(this.statsFile)) {
                const data = fs.readFileSync(this.statsFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
        
        // Estatísticas padrão
        return {
            totalSongsPlayed: 0,
            totalServers: 0,
            totalUsers: 0,
            realTimeSongs: [],
            activeServers: [],
            activeUsers: [],
            uptime: 0,
            lastUpdated: Date.now()
        };
    }

    saveStats() {
        try {
            this.stats.totalSongsPlayed = this.totalSongsPlayed;
            this.stats.realTimeSongs = this.realTimeSongs;
            this.stats.activeServers = Array.from(this.activeServers);
            this.stats.activeUsers = Array.from(this.activeUsers);
            this.stats.uptime = Date.now() - this.startTime;
            this.stats.lastUpdated = Date.now();
            
            fs.writeFileSync(this.statsFile, JSON.stringify(this.stats, null, 2));
        } catch (error) {
            console.error('Erro ao salvar estatísticas:', error);
        }
    }

    updateServerCount(client) {
        if (client && client.guilds) {
            this.stats.totalServers = client.guilds.cache.size;
            this.stats.totalUsers = client.users.cache.size;
            
            // Atualizar servidores ativos
            client.guilds.cache.forEach(guild => {
                this.activeServers.add(guild.id);
                guild.members.cache.forEach(member => {
                    this.activeUsers.add(member.id);
                });
            });
            
            this.saveStats();
        }
    }

    incrementSongsPlayed() {
        this.totalSongsPlayed++;
        this.saveStats();
    }

    // Adicionar música em tempo real
    addRealTimeSong(songData) {
        const song = {
            id: Date.now(),
            title: songData.title,
            artist: songData.artist,
            duration: songData.duration,
            server: songData.server,
            user: songData.user,
            timestamp: Date.now()
        };
        
        this.realTimeSongs.push(song);
        
        // Manter apenas as últimas 100 músicas
        if (this.realTimeSongs.length > 100) {
            this.realTimeSongs = this.realTimeSongs.slice(-100);
        }
        
        this.saveStats();
        return song;
    }

    // Obter músicas em tempo real
    getRealTimeSongs(limit = 10) {
        return this.realTimeSongs
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    getStats() {
        const uptime = Date.now() - this.startTime;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

        return {
            servers: this.stats.totalServers,
            users: this.stats.totalUsers,
            songsPlayed: this.totalSongsPlayed,
            realTimeSongs: this.realTimeSongs.length,
            activeServers: this.activeServers.size,
            activeUsers: this.activeUsers.size,
            uptime: `${days}d ${hours}h ${minutes}m`,
            lastUpdated: this.stats.lastUpdated
        };
    }

    // Método para obter estatísticas formatadas para o site
    getWebsiteStats() {
        const stats = this.getStats();
        return {
            servers: `${stats.servers}+`,
            users: `${Math.floor(stats.users / 1000)}K+`,
            songs: `${Math.floor(stats.songsPlayed / 1000)}K+`
        };
    }

    // Simular músicas em tempo real para demonstração
    simulateRealTimeMusic() {
        const demoSongs = [
            { title: "Funk do TikTok", artist: "MC Kevin o Chris", duration: "2:45", server: "Gaming Hub", user: "João123" },
            { title: "Samba de Roda", artist: "Ivete Sangalo", duration: "3:20", server: "Música Brasil", user: "Maria456" },
            { title: "Rock Nacional", artist: "Legião Urbana", duration: "4:15", server: "Rock Club", user: "Pedro789" },
            { title: "MPB Clássica", artist: "Marisa Monte", duration: "3:50", server: "MPB Lounge", user: "Ana321" },
            { title: "Trap Brasileiro", artist: "Luísa Sonza", duration: "3:10", server: "Trap Nation", user: "Carlos654" },
            { title: "Axé 2025", artist: "Daniela Mercury", duration: "3:35", server: "Axé Party", user: "Lucia987" },
            { title: "Pagode Romântico", artist: "Exaltasamba", duration: "3:40", server: "Pagode Bar", user: "Roberto147" },
            { title: "Forró Universitário", artist: "Wesley Safadão", duration: "3:25", server: "Forró Dance", user: "Fernanda258" }
        ];

        // Adicionar música aleatória a cada 30 segundos
        setInterval(() => {
            const randomSong = demoSongs[Math.floor(Math.random() * demoSongs.length)];
            this.addRealTimeSong(randomSong);
            console.log(`🎵 Nova música em tempo real: ${randomSong.title} - ${randomSong.artist}`);
        }, 30000);
    }
}

// Criar instância global
global.botStats = new BotStats();

// Iniciar simulação de músicas em tempo real
global.botStats.simulateRealTimeMusic();

// Exportar para uso em outros arquivos
module.exports = global.botStats; 