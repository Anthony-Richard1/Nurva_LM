// Funcionalidades específicas para a página Explorar
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando página Explorar...");
    
    // Verificar se o banco de dados de músicas está disponível
    if (typeof musicDatabase === 'undefined' || !Array.isArray(musicDatabase) || musicDatabase.length === 0) {
        console.error("Banco de dados de músicas não disponível!");
        showErrorMessage("Não foi possível carregar o banco de dados de músicas");
        return;
    }
    
    // Inicializar componentes da página
    initializeFiltros();
    loadExploreSection();
    loadTrendingSection();
    setupPlaylistsAndPlayer();
    
    // Configurar eventos para a barra de pesquisa
    setupSearchBar();
});

// Inicializar e configurar os filtros de gênero
function initializeFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            // Remover classe ativo de todos os filtros
            filtros.forEach(f => f.classList.remove('ativo'));
            
            // Adicionar classe ativo ao filtro clicado
            this.classList.add('ativo');
            
            // Filtrar músicas com base no gênero selecionado
            const genero = this.textContent.trim();
            filterMusicByGenre(genero);
        });
    });
}

// Filtrar músicas por gênero
function filterMusicByGenre(genero) {
    console.log(`Filtrando músicas por gênero: ${genero}`);
    
    let filteredSongs;
    
    if (genero === 'Para Você') {
        // Para a categoria "Para Você", exibir músicas recomendadas ou aleatórias
        filteredSongs = getRandomSongs(12);
    } else {
        // Filtrar por gênero específico
        filteredSongs = musicDatabase.filter(song => {
            return song.genre && song.genre.toLowerCase() === genero.toLowerCase();
        });
        
        // Se não houver músicas suficientes desse gênero, adicionar algumas aleatórias
        if (filteredSongs.length < 6) {
            const randomSongs = getRandomSongs(6 - filteredSongs.length);
            filteredSongs = [...filteredSongs, ...randomSongs];
        }
    }
    
    // Limitar a 6 músicas para "Explore novos mares"
    const exploreSongs = filteredSongs.slice(0, 6);
    renderExploreSection(exploreSongs);
    
    // Limitar a 5 músicas para "Em alta no momento"
    const trendingSongs = filteredSongs.slice(6, 11);
    renderTrendingSection(trendingSongs.length > 0 ? trendingSongs : getRandomSongs(5));
}

// Obter músicas aleatórias do banco de dados
function getRandomSongs(count) {
    // Clonar e embaralhar o array de músicas
    const shuffled = [...musicDatabase].sort(() => 0.5 - Math.random());
    // Retornar o número solicitado de músicas
    return shuffled.slice(0, count);
}

// Carregar e renderizar seção "Explore novos mares"
function loadExploreSection() {
    // Obter músicas aleatórias para a seção inicial
    const songs = getRandomSongs(6);
    renderExploreSection(songs);
}

// Renderizar a seção "Explore novos mares" com as músicas fornecidas
function renderExploreSection(songs) {
    const container = document.querySelector('.secao:nth-of-type(1) .grid-cards');
    if (!container) {
        console.error("Container para 'Explore novos mares' não encontrado");
        return;
    }
    
    container.innerHTML = '';
    
    songs.forEach(async (song, index) => {
        // Assegurar que a música tenha um ID
        const songId = song.id || index + 1;
        
        // Usar a função getThumbnail do musicManager.js para obter a thumbnail correta
        let thumbnailPath;
        if (typeof getThumbnail === 'function') {
            thumbnailPath = await getThumbnail(song);
        } else {
            // Fallback se a função não estiver disponível
            thumbnailPath = song.thumbnail || '../public/assets/thumbnails/default.jpg';
            thumbnailPath = normalizePath(thumbnailPath);
        }
        
        // Criar elemento da música
        const musicElement = document.createElement('div');
        musicElement.className = 'musica grid-cards-item';
        musicElement.setAttribute('data-id', songId);
        
        musicElement.innerHTML = `
            <div class="image-container">
                <img src="${thumbnailPath}" alt="${song.title}" class="foto">
            </div>
            <div class="textos">
                <div class="titulo-da-musica">${song.title}</div>
                <div class="artista-nome">${song.artist} ${song.album ? '• ' + song.album : ''}</div>
            </div>
        `;
        
        // Adicionar evento de clique para reproduzir a música
        musicElement.addEventListener('click', function() {
            if (typeof playSong === 'function') {
                playSong(songId);
            } else {
                console.error("Função playSong não encontrada");
            }
        });
        
        container.appendChild(musicElement);
    });
}

// Carregar e renderizar seção "Em alta no momento"
function loadTrendingSection() {
    // Obter músicas aleatórias para a seção "Em alta"
    const songs = getRandomSongs(5);
    renderTrendingSection(songs);
}

// Renderizar a seção "Em alta no momento" com as músicas fornecidas
function renderTrendingSection(songs) {
    const container = document.querySelector('.secao:nth-of-type(2) .grid-cards');
    if (!container) {
        console.error("Container para 'Em alta no momento' não encontrado");
        return;
    }
    
    container.innerHTML = '';
    
    songs.forEach(async (song, index) => {
        // Assegurar que a música tenha um ID
        const songId = song.id || index + 1;
        
        // Usar a função getThumbnail do musicManager.js para obter a thumbnail correta
        let thumbnailPath;
        if (typeof getThumbnail === 'function') {
            thumbnailPath = await getThumbnail(song);
        } else {
            // Fallback se a função não estiver disponível
            thumbnailPath = song.thumbnail || '../public/assets/thumbnails/default.jpg';
            thumbnailPath = normalizePath(thumbnailPath);
        }
        
        // Criar elemento da música
        const musicElement = document.createElement('div');
        musicElement.className = 'musica grid-cards-item';
        musicElement.setAttribute('data-id', songId);
        
        musicElement.innerHTML = `
            <div class="image-container">
                <img src="${thumbnailPath}" alt="${song.title}" class="foto">
            </div>
            <div class="textos">
                <div class="titulo-da-musica">${song.title}</div>
                <div class="artista-nome">Música • ${song.artist}</div>
            </div>
        `;
        
        // Adicionar evento de clique para reproduzir a música
        musicElement.addEventListener('click', function() {
            if (typeof playSong === 'function') {
                playSong(songId);
            } else {
                console.error("Função playSong não encontrada");
            }
        });
        
        container.appendChild(musicElement);
    });
}

// Configurar a área de playlists e player
function setupPlaylistsAndPlayer() {
    // Verificar se há um contêiner de playlists
    const playlistsContainer = document.getElementById('playlists-container');
    if (playlistsContainer) {
        // Verificar se a função renderUserPlaylists está disponível
        if (typeof loadUserPlaylists === 'function') {
            loadUserPlaylists();
        } else if (typeof renderUserPlaylists === 'function') {
            renderUserPlaylists();
        } else {
            console.warn("Funções de playlist não encontradas");
        }
        
        // Configurar botão para criar playlist
        const createPlaylistBtn = document.getElementById('create-playlist-btn');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', function() {
                if (typeof showCreatePlaylistDialog === 'function') {
                    showCreatePlaylistDialog();
                } else {
                    console.error("Função showCreatePlaylistDialog não encontrada");
                }
            });
        }
    }
    
    // Verificar se o player precisa ser inicializado
    if (typeof setupPlayer === 'function') {
        setupPlayer();
    }
}

// Configurar a barra de pesquisa
function setupSearchBar() {
    const searchInput = document.querySelector('.barra-pesquisa-topo input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length < 2) return;
        
        // Se a função searchSongs estiver disponível, use-a
        if (typeof searchSongs === 'function') {
            const results = searchSongs(query);
            if (results && results.length > 0) {
                // Exibir os resultados na primeira seção
                renderExploreSection(results.slice(0, 6));
            }
        }
    });
}

// Função para normalizar caminhos de arquivos
function normalizePath(path) {
    if (!path) return '../public/assets/thumbnails/default.jpg';
    
    // Se o caminho já começar com http ou data:, é uma URL ou base64, retorne como está
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }
    
    // Se estivermos numa subpágina (pages/), adicione um ../ ao caminho se necessário
    if (window.location.pathname.includes('/pages/')) {
        if (path.startsWith('/')) {
            return '..' + path;
        } else if (!path.startsWith('../')) {
            return '../' + path;
        }
    }
    
    return path;
}

// Exibir mensagem de erro quando o banco de dados não estiver disponível
function showErrorMessage(message) {
    const sections = document.querySelectorAll('.secao');
    
    sections.forEach(section => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.padding = '20px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.margin = '20px 0';
        errorDiv.textContent = message;
        
        const gridContainer = section.querySelector('.grid-cards');
        if (gridContainer) {
            gridContainer.innerHTML = '';
            section.appendChild(errorDiv);
        }
    });
} 