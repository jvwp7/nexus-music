const express = require('express');
const cors = require('cors');
const path = require('path');
const botStats = require('./stats');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Website')));

// Rota para estatísticas do bot
app.get('/api/stats', (req, res) => {
    try {
        const stats = botStats.getWebsiteStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para estatísticas detalhadas
app.get('/api/stats/detailed', (req, res) => {
    try {
        const stats = botStats.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas detalhadas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para músicas em tempo real
app.get('/api/realtime-songs', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const songs = botStats.getRealTimeSongs(limit);
        res.json({
            success: true,
            data: songs
        });
    } catch (error) {
        console.error('Erro ao obter músicas em tempo real:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para adicionar música em tempo real (simulação)
app.post('/api/add-song', (req, res) => {
    try {
        const { title, artist, duration, server, user } = req.body;
        
        if (!title || !artist) {
            return res.status(400).json({
                success: false,
                error: 'Título e artista são obrigatórios'
            });
        }

        const songData = {
            title,
            artist,
            duration: duration || '3:30',
            server: server || 'Servidor Demo',
            user: user || 'Usuário Demo'
        };

        const song = botStats.addRealTimeSong(songData);
        
        res.json({
            success: true,
            data: song,
            message: 'Música adicionada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Website', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌐 Servidor API rodando na porta ${PORT}`);
    console.log(`📊 Endpoint de estatísticas: http://localhost:${PORT}/api/stats`);
    console.log(`📈 Endpoint detalhado: http://localhost:${PORT}/api/stats/detailed`);
    console.log(`🎵 Endpoint músicas em tempo real: http://localhost:${PORT}/api/realtime-songs`);
    console.log(`➕ Endpoint adicionar música: http://localhost:${PORT}/api/add-song`);
});

module.exports = app; 