// Music Manager - Gerencia o acesso ao banco de dados de músicas existente

// Função para obter o URL base (para uso em ambiente de desenvolvimento e produção)
function getBaseUrl() {
    return window.location.origin;
}

// Cache para thumbnails verificados
const thumbnailCache = new Map();
// Cache para arquivos de áudio verificados
const audioCache = new Map();

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

// Verificar se um thumbnail existe
async function checkThumbnailExists(thumbnailPath) {
    // Verifica se já está em cache
    if (thumbnailCache.has(thumbnailPath)) {
        return thumbnailCache.get(thumbnailPath);
    }
    
    // Remove o prefixo 'public' se estiver presente
    const path = thumbnailPath.replace('public/', '');
    
    // Cria um objeto Image para testar se o thumbnail existe
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            thumbnailCache.set(thumbnailPath, true);
            resolve(true);
        };
        img.onerror = () => {
            thumbnailCache.set(thumbnailPath, false);
            console.warn(`Thumbnail não encontrado: ${thumbnailPath}`);
            resolve(false);
        };
        // Adiciona parâmetro timestamp para evitar cache do navegador
        img.src = `${path}?t=${new Date().getTime()}`;
    });
}

// Verificar se um arquivo de áudio existe
async function checkAudioExists(audioPath) {
    // Verifica se já está em cache
    if (audioCache.has(audioPath)) {
        return audioCache.get(audioPath);
    }
    
    // Remove o prefixo 'public' se estiver presente
    const path = audioPath.replace('public/', '');
    
    // Tenta fazer uma solicitação HEAD para o arquivo de áudio
    return new Promise((resolve) => {
        fetch(path, { method: 'HEAD' })
            .then(response => {
                const exists = response.ok;
                audioCache.set(audioPath, exists);
                if (!exists) {
                    console.warn(`Arquivo de áudio não encontrado: ${audioPath}`);
                }
                resolve(exists);
            })
            .catch(() => {
                audioCache.set(audioPath, false);
                console.warn(`Erro ao verificar arquivo de áudio: ${audioPath}`);
                resolve(false);
            });
    });
}

// Limpar os caches (útil para desenvolvimento)
function clearCaches() {
    thumbnailCache.clear();
    audioCache.clear();
    console.log("Caches de verificação limpos");
}

// Obter um thumbnail alternativo se o original não existir
async function getThumbnail(song) {
    if (!song || !song.thumbnail) return 'assets/thumbnails/default.jpg';
    
    const exists = await checkThumbnailExists(song.thumbnail);
    if (exists) return song.thumbnail;
    
    // Tenta encontrar um thumbnail pelo nome do artista
    const artistName = song.artist.split(',')[0].trim(); // Pega apenas o primeiro artista
    const artistSongs = getSongsByArtist(artistName);
    
    for (const artistSong of artistSongs) {
        if (artistSong.id !== song.id && artistSong.thumbnail) {
            const artistThumbnailExists = await checkThumbnailExists(artistSong.thumbnail);
            if (artistThumbnailExists) {
                console.log(`Usando thumbnail alternativo para ${song.title}: ${artistSong.thumbnail}`);
                return artistSong.thumbnail;
            }
        }
    }
    
    // Se não encontrar nenhum thumbnail do artista, usa o padrão
    console.log(`Usando thumbnail padrão para ${song.title}`);
    return 'assets/thumbnails/default.jpg';
}

// Obter um arquivo de áudio alternativo ou indicar que não existe
async function getAudioPath(song) {
    if (!song || !song.audioPath) return null;
    
    const exists = await checkAudioExists(song.audioPath);
    if (exists) return song.audioPath;
    
    // Se não existir, retorna null - o player deve lidar com isso
    return null;
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

// Pesquisar músicas por título, artista ou álbum
function searchSongs(query) {
    if (!musicDatabase || !query) return [];
    
    query = query.toLowerCase();
    return musicDatabase.filter(song => 
        (song.title && song.title.toLowerCase().includes(query)) ||
        (song.artist && song.artist.toLowerCase().includes(query)) ||
        (song.album && song.album.toLowerCase().includes(query))
    );
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

// Verificar integridade do banco de dados de música
async function checkDatabaseIntegrity() {
    if (!musicDatabase) return { status: false, errors: ['Banco de dados não encontrado'] };
    
    const errors = [];
    const thumbnailIssues = [];
    const audioIssues = [];
    let checkedCount = 0;
    
    for (const song of musicDatabase) {
        // Verificar dados essenciais
        if (!song.id) errors.push(`Música sem ID: ${song.title || 'Desconhecido'}`);
        if (!song.title) errors.push(`Música sem título (ID: ${song.id || 'Desconhecido'})`);
        if (!song.artist) errors.push(`Música sem artista: ${song.title || 'Desconhecido'}`);
        
        // Verificar thumbnail
        if (!song.thumbnail) {
            thumbnailIssues.push(`Música sem thumbnail: ${song.title || 'Desconhecido'}`);
        } else {
            const thumbnailExists = await checkThumbnailExists(song.thumbnail);
            if (!thumbnailExists) {
                thumbnailIssues.push(`Thumbnail não encontrado para ${song.title}: ${song.thumbnail}`);
            }
        }
        
        // Verificar audio
        if (!song.audioPath) {
            audioIssues.push(`Música sem arquivo de áudio: ${song.title || 'Desconhecido'}`);
        } else {
            const audioExists = await checkAudioExists(song.audioPath);
            if (!audioExists) {
                audioIssues.push(`Arquivo de áudio não encontrado para ${song.title}: ${song.audioPath}`);
            }
        }
        
        checkedCount++;
        if (checkedCount % 10 === 0) {
            console.log(`Verificados ${checkedCount}/${musicDatabase.length} itens...`);
        }
    }
    
    return { 
        status: errors.length === 0 && thumbnailIssues.length === 0 && audioIssues.length === 0, 
        errors,
        thumbnailIssues,
        audioIssues,
        totalSongs: musicDatabase.length,
        checkedCount
    };
}

// Validar uma música específica
async function validateSong(songId) {
    const song = getSongById(songId);
    if (!song) return { valid: false, error: 'Música não encontrada' };
    
    const results = { 
        id: song.id,
        title: song.title,
        artist: song.artist,
        valid: true, 
        errors: [] 
    };
    
    // Verificar thumbnail
    if (!song.thumbnail) {
        results.errors.push('Sem thumbnail');
        results.thumbnailValid = false;
    } else {
        const thumbnailExists = await checkThumbnailExists(song.thumbnail);
        results.thumbnailValid = thumbnailExists;
        if (!thumbnailExists) {
            results.errors.push(`Thumbnail não encontrado: ${song.thumbnail}`);
        }
    }
    
    // Verificar audio
    if (!song.audioPath) {
        results.errors.push('Sem arquivo de áudio');
        results.audioValid = false;
    } else {
        const audioExists = await checkAudioExists(song.audioPath);
        results.audioValid = audioExists;
        if (!audioExists) {
            results.errors.push(`Arquivo de áudio não encontrado: ${song.audioPath}`);
        }
    }
    
    results.valid = results.errors.length === 0;
    return results;
}

// Criar thumbnails de fallback padrão para músicas sem thumbnails válidos
function createDefaultThumbnails() {
    // Implementação básica - pode ser expandida para gerar thumbnails personalizados
    return new Promise(async (resolve) => {
        const processed = { success: 0, failed: 0 };
        
        for (const song of musicDatabase) {
            if (song.thumbnail) {
                const exists = await checkThumbnailExists(song.thumbnail);
                if (!exists) {
                    const artistInitial = song.artist.charAt(0).toUpperCase();
                    console.log(`Thumbnail não encontrado para ${song.title}. Seria criado com inicial ${artistInitial}`);
                    // Aqui você poderia implementar a geração de thumbnails
                    processed.success++;
                }
            } else {
                processed.failed++;
            }
        }
        
        resolve(processed);
    });
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
            
            // Verificar a integridade do banco de dados
            checkDatabaseIntegrity().then(integrity => {
                if (!integrity.status) {
                    console.warn(`Problemas detectados no banco de dados de músicas: ${integrity.errors.length} erros, ${integrity.thumbnailIssues.length} problemas de thumbnail, ${integrity.audioIssues.length} problemas de áudio`);
                    
                    // Saída detalhada apenas em desenvolvimento
                    if (process.env.NODE_ENV === 'development') {
                        if (integrity.errors.length > 0) {
                            console.group('Erros de dados:');
                            integrity.errors.forEach(err => console.error(err));
                            console.groupEnd();
                        }
                        
                        if (integrity.thumbnailIssues.length > 0) {
                            console.group('Problemas com thumbnails:');
                            integrity.thumbnailIssues.forEach(issue => console.warn(issue));
                            console.groupEnd();
                        }
                        
                        if (integrity.audioIssues.length > 0) {
                            console.group('Problemas com arquivos de áudio:');
                            integrity.audioIssues.forEach(issue => console.warn(issue));
                            console.groupEnd();
                        }
                    }
                } else {
                    console.log('Verificação de integridade do banco de dados concluída com sucesso!');
                }
            });
        }
    }, 1000);
});

// Exporta as funções
window.musicManager = {
    getAllSongs,
    getSongsByGenre,
    getSongsByArtist,
    getSongById,
    checkThumbnailExists,
    checkAudioExists,
    getThumbnail,
    getAudioPath,
    getPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    addToRecentlyPlayed,
    searchSongs,
    getMusicDatabaseStats,
    checkDatabaseIntegrity,
    validateSong,
    clearCaches
}; 