// Music Manager - Gerencia o acesso ao banco de dados de músicas existente

// Funções de utilidade para acesso ao banco de dados de músicas

// Obter todas as músicas do banco de dados
function getAllSongs() {
    return musicDatabase || [];
}

// Filtrar músicas por gênero
function getSongsByGenre(genre) {
    if (!musicDatabase) return [];
    return musicDatabase.filter(song => song.genre && song.genre.toLowerCase() === genre.toLowerCase());
}

// Obter músicas por artista
function getSongsByArtist(artist) {
    if (!musicDatabase) return [];
    return musicDatabase.filter(song => song.artist.toLowerCase().includes(artist.toLowerCase()));
}

// Obter música pelo ID
function getSongById(id) {
    if (!musicDatabase) return null;
    return musicDatabase.find(song => song.id === id);
}

// Gerenciar playlists - usando a variável existente no musicdata.js ou criando se não existir
// Verifica se playlists já existe no escopo global e usa-o; caso contrário, cria um novo
if (typeof window.playlists === 'undefined') {
    window.playlists = {
        favorites: [],
        recentlyPlayed: []
    };
} 
// Garante que estamos sempre operando na variável global
const playlists = window.playlists;

// Obter uma playlist pelo nome
function getPlaylist(playlistName) {
    if (!playlists[playlistName]) return [];
    
    return playlists[playlistName].map(id => getSongById(id)).filter(Boolean);
}

// Adicionar uma música a uma playlist
function addToPlaylist(songId, playlistName) {
    if (!playlists[playlistName]) {
        playlists[playlistName] = [];
    }
    
    if (!playlists[playlistName].includes(songId)) {
        playlists[playlistName].push(songId);
        console.log(`Música ${songId} adicionada à playlist ${playlistName}`);
        
        // Salvar na localStorage
        savePlaylistsToLocalStorage();
        return true;
    }
    
    return false;
}

// Remover uma música de uma playlist
function removeFromPlaylist(songId, playlistName) {
    if (!playlists[playlistName]) return false;
    
    const initialLength = playlists[playlistName].length;
    playlists[playlistName] = playlists[playlistName].filter(id => id !== songId);
    
    if (playlists[playlistName].length < initialLength) {
        console.log(`Música ${songId} removida da playlist ${playlistName}`);
        
        // Salvar na localStorage
        savePlaylistsToLocalStorage();
        return true;
    }
    
    return false;
}

// Criar uma nova playlist
function createPlaylist(playlistName) {
    if (playlists[playlistName]) {
        console.warn(`Playlist ${playlistName} já existe`);
        return false;
    }
    
    playlists[playlistName] = [];
    console.log(`Playlist ${playlistName} criada`);
    
    // Salvar na localStorage
    savePlaylistsToLocalStorage();
    return true;
}

// Salvar playlists no localStorage
function savePlaylistsToLocalStorage() {
    try {
        localStorage.setItem('nurva_playlists', JSON.stringify(playlists));
        return true;
    } catch (error) {
        console.error('Erro ao salvar playlists:', error);
        return false;
    }
}

// Carregar playlists do localStorage
function loadPlaylistsFromLocalStorage() {
    try {
        const savedPlaylists = localStorage.getItem('nurva_playlists');
        if (savedPlaylists) {
            // Usa a variável global para armazenar os dados
            Object.assign(window.playlists, JSON.parse(savedPlaylists));
            console.log('Playlists carregadas do localStorage');
            return true;
        }
    } catch (error) {
        console.error('Erro ao carregar playlists:', error);
    }
    
    return false;
}

// Registrar músicas recentemente reproduzidas
function addToRecentlyPlayed(songId) {
    // Remover a música se já estiver na lista
    playlists.recentlyPlayed = playlists.recentlyPlayed.filter(id => id !== songId);
    
    // Adicionar no início
    playlists.recentlyPlayed.unshift(songId);
    
    // Limitar a 20 músicas
    if (playlists.recentlyPlayed.length > 20) {
        playlists.recentlyPlayed = playlists.recentlyPlayed.slice(0, 20);
    }
    
    // Salvar na localStorage
    savePlaylistsToLocalStorage();
}

// Obter estatísticas do banco de dados
function getMusicDatabaseStats() {
    if (!musicDatabase) return { total: 0, artists: 0, genres: 0 };
    
    const uniqueArtists = new Set();
    const uniqueGenres = new Set();
    
    musicDatabase.forEach(song => {
        if (song.artist) uniqueArtists.add(song.artist);
        if (song.genre) uniqueGenres.add(song.genre);
    });
    
    return {
        total: musicDatabase.length,
        artists: uniqueArtists.size,
        genres: uniqueGenres.size
    };
}

// Carregar playlists ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando gerenciador de música...");
    loadPlaylistsFromLocalStorage();
    
    // Mostrar estatísticas no console
    setTimeout(() => {
        if (typeof musicDatabase !== 'undefined') {
            const stats = getMusicDatabaseStats();
            console.log(`Banco de dados carregado: ${stats.total} músicas, ${stats.artists} artistas, ${stats.genres} gêneros`);
        }
    }, 1000);
}); 