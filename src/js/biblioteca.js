// biblioteca.js - Responsável pelas funcionalidades da página de biblioteca

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de biblioteca...');
    
    // Verificar se o banco de dados de música está disponível
    if (typeof musicDatabase === 'undefined' || !musicDatabase) {
        console.error('Banco de dados de música não disponível');
        setTimeout(() => {
            if (typeof musicDatabase !== 'undefined' && musicDatabase) {
                initBibliotecaPage();
            } else {
                showErrorMessage('Não foi possível carregar o conteúdo musical. Tente recarregar a página.');
            }
        }, 1000);
        return;
    }
    
    // Inicializar objeto userPlaylists se não existir
    if (typeof window.userPlaylists === 'undefined') {
        initUserPlaylists();
    }
    
    initBibliotecaPage();
});

// Inicializar o objeto userPlaylists com playlists padrão
function initUserPlaylists() {
    console.log('Inicializando playlists do usuário...');
    
    // Verificar se temos playlists salvas no localStorage
    const savedPlaylists = localStorage.getItem('nurvaUserPlaylists');
    
    if (savedPlaylists) {
        try {
            window.userPlaylists = JSON.parse(savedPlaylists);
            console.log('Playlists carregadas do localStorage:', Object.keys(window.userPlaylists));
        } catch (e) {
            console.error('Erro ao carregar playlists do localStorage:', e);
            createDefaultPlaylists();
        }
    } else {
        // Criar playlists padrão
        createDefaultPlaylists();
    }
}

// Criar playlists padrão para o usuário
function createDefaultPlaylists() {
    console.log('Criando playlists padrão...');
    
    window.userPlaylists = {
        "Playlist para chorar no banho": {
            songs: [],
            createdBy: "Você",
            createdAt: new Date().toISOString()
        },
        "Playlist para animar pro vôlei": {
            songs: [],
            createdBy: "Você",
            createdAt: new Date().toISOString()
        },
        "Playlist para estudar": {
            songs: [],
            createdBy: "Você",
            createdAt: new Date().toISOString()
        },
        "Rap Nacional": {
            songs: [],
            createdBy: "Bernardo",
            createdAt: new Date().toISOString()
        }
    };
    
    // Adicionar algumas músicas às playlists se o banco de dados estiver disponível
    if (musicDatabase && musicDatabase.length > 0) {
        // Encontrar algumas músicas para adicionar
        const cryingSongs = musicDatabase.filter(song => 
            song.title && (
                song.title.toLowerCase().includes('love') || 
                song.title.toLowerCase().includes('sad') ||
                song.artist && song.artist.toLowerCase().includes('adele')
            )
        ).slice(0, 3);
        
        const energeticSongs = musicDatabase.filter(song => 
            song.title && (
                song.title.toLowerCase().includes('party') || 
                song.title.toLowerCase().includes('night') ||
                song.artist && song.artist.toLowerCase().includes('dua lipa')
            )
        ).slice(0, 3);
        
        const studySongs = musicDatabase.filter(song => 
            song.title && (
                song.title.toLowerCase().includes('chill') || 
                song.title.toLowerCase().includes('calm') ||
                song.artist && song.artist.toLowerCase().includes('weeknd')
            )
        ).slice(0, 3);
        
        const rapSongs = musicDatabase.filter(song => 
            song.artist && (
                song.artist.toLowerCase().includes('racionais') || 
                song.artist.toLowerCase().includes('djonga') ||
                song.artist.toLowerCase().includes('emicida')
            )
        ).slice(0, 3);
        
        // Adicionar as músicas às playlists
        window.userPlaylists["Playlist para chorar no banho"].songs = cryingSongs.map(song => song.id);
        window.userPlaylists["Playlist para animar pro vôlei"].songs = energeticSongs.map(song => song.id);
        window.userPlaylists["Playlist para estudar"].songs = studySongs.map(song => song.id);
        window.userPlaylists["Rap Nacional"].songs = rapSongs.map(song => song.id);
    }
    
    // Salvar no localStorage
    try {
        localStorage.setItem('nurvaUserPlaylists', JSON.stringify(window.userPlaylists));
        console.log('Playlists padrão criadas e salvas no localStorage');
    } catch (e) {
        console.error('Erro ao salvar playlists no localStorage:', e);
    }
}

// Inicializar a página da biblioteca
function initBibliotecaPage() {
    console.log('Carregando conteúdo da página da biblioteca...');
    
    // Verificar se navegamos direto para a biblioteca e precisamos atualizar
    const shouldRefresh = sessionStorage.getItem('nurvaLibraryRefresh');
    if (shouldRefresh) {
        console.log('Navegação direta para a biblioteca, garantindo dados atualizados');
        // Limpar o marcador para não recarregar novamente em refresh simples
        sessionStorage.removeItem('nurvaLibraryRefresh');
    }
    
    // Carregar playlists do usuário
    loadUserPlaylistsSection();
    
    // Carregar músicas curtidas
    loadLikedSongsSection();
    
    // Inicializar a pesquisa na biblioteca
    initBibliotecaSearch();
    
    // Inicializar o player com uma música específica (Timeless)
    initSpecificSong();
    
    // Adicionar listener para eventos de favoritos
    setupFavoritesListener();
    
    // Configurar evento para recarregar músicas curtidas quando a página receber foco
    window.addEventListener('focus', function() {
        console.log('Página da biblioteca recebeu foco, recarregando músicas curtidas...');
        loadLikedSongsSection();
    });
    
    // Verificar se foi navegado de uma página para outra
    window.addEventListener('pageshow', function(event) {
        // Se a página foi carregada do cache (navegação entre páginas)
        if (event.persisted) {
            console.log('Página carregada do cache, recarregando músicas curtidas...');
            loadLikedSongsSection();
        }
    });
}

// Exibir mensagem de erro
function showErrorMessage(message, container) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;';
    
    if (container) {
        container.innerHTML = '';
        container.appendChild(errorElement);
    } else {
        // Adicionar a todos os contêineres de grid
        document.querySelectorAll('.grid-cards').forEach(grid => {
            grid.innerHTML = '';
            grid.appendChild(errorElement.cloneNode(true));
        });
    }
}

// Carregar a seção de playlists do usuário
function loadUserPlaylistsSection() {
    const playlistsContainer = document.getElementById('suas-playlists');
    if (!playlistsContainer) return;
    
    playlistsContainer.innerHTML = ''; // Limpar conteúdo existente
    
    // Verificar se temos o objeto userPlaylists disponível
    if (typeof window.userPlaylists === 'undefined' || Object.keys(window.userPlaylists).length === 0) {
        console.warn('Objeto userPlaylists não disponível ou vazio.');
        
        // Mostrar mensagem quando não há playlists
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = `
            <div class="empty-icon"><i class="fas fa-music"></i></div>
            <h3>Você não tem playlists ainda</h3>
            <p>Clique em "+ Criar Nova Playlist" para começar a organizar suas músicas</p>
        `;
        playlistsContainer.appendChild(emptyMessage);
        return;
    }
    
    // Carregar playlists dinâmicamente do objeto userPlaylists
    Object.keys(window.userPlaylists).forEach((playlistName, index) => {
        const playlist = window.userPlaylists[playlistName];
        const playlistCard = createPlaylistCard({
            name: playlistName,
            id: `playlist-${index}`,
            data: playlist
        });
        
        if (playlistCard) {
            playlistsContainer.appendChild(playlistCard);
        }
    });
    
    // Adicionar animações aos cards
    animateCards(playlistsContainer);
}

// Criar card de playlist
function createPlaylistCard(playlistInfo) {
    // Usar os dados da playlist passados como parâmetro
    const playlist = playlistInfo.data || {
        name: playlistInfo.name,
        songs: [],
        createdBy: "Anthony Richard"
    };
    
    // Criar o elemento do card
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.setAttribute('data-playlist-id', playlistInfo.id);
    card.setAttribute('data-playlist-name', playlistInfo.name);
    
    // Determinar as imagens para o card
    let coverImages = [];
    
    // Se a playlist tem músicas, usar as thumbnails das músicas
    if (playlist.songs && playlist.songs.length > 0) {
        // Obter até 4 imagens de thumbnail das músicas da playlist
        const songsWithThumbnails = [];
        
        playlist.songs.forEach(songId => {
            const song = getSongById(songId);
            if (song && song.thumbnail) {
                songsWithThumbnails.push(normalizePath(song.thumbnail));
            }
        });
        
        // Usar até 4 imagens da playlist
        coverImages = songsWithThumbnails.slice(0, 4);
        
        // Se não tiver 4 imagens, completar com thumbnails padrão
        while (coverImages.length < 4) {
            coverImages.push(normalizePath('assets/thumbnails/default.jpg'));
        }
    } else {
        // Se não tem músicas, usar imagens padrão
        coverImages = [
            normalizePath('assets/thumbnails/default.jpg'),
            normalizePath('assets/thumbnails/default.jpg'),
            normalizePath('assets/thumbnails/default.jpg'),
            normalizePath('assets/thumbnails/default.jpg')
        ];
    }
    
    // Estrutura HTML para o card
    card.innerHTML = `
        <div class="playlist-card-images">
            ${coverImages.map(img => `<img src="${img}" alt="Capa da playlist">`).join('')}
        </div>
        <div class="playlist-card-info">
            <h3 class="playlist-card-title">${playlistInfo.name}</h3>
            <p class="playlist-card-creator">Criada por ${playlist.createdBy || "Você"}</p>
        </div>
    `;
    
    // Adicionar evento de clique para reproduzir a playlist
    card.addEventListener('click', () => {
        if (typeof window.playPlaylist === 'function') {
            window.playPlaylist(playlistInfo.name);
        } else {
            console.warn('Função playPlaylist não disponível');
        }
    });
    
    return card;
}

// Carregar a seção de músicas curtidas
function loadLikedSongsSection() {
    const likedSongsContainer = document.getElementById('musicas-curtidas');
    if (!likedSongsContainer) return;
    
    likedSongsContainer.innerHTML = ''; // Limpar conteúdo existente
    
    // Obter IDs de músicas curtidas do localStorage
    const favorites = JSON.parse(localStorage.getItem('nurvaFavorites')) || [];
    
    // Se não houver músicas curtidas, mostrar uma mensagem
    if (favorites.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = `
            <div class="empty-icon"><i class="fas fa-heart"></i></div>
            <h3>Suas músicas curtidas aparecerão aqui</h3>
            <p>Clique no botão de coração ao ouvir uma música para adicioná-la aos seus favoritos</p>
        `;
        likedSongsContainer.appendChild(emptyMessage);
    } else {
        // Buscar detalhes das músicas e criar cards
        favorites.forEach((songId, index) => {
            const song = getSongById(songId);
            if (song) {
                const songCard = createMusicCard(song, index);
                if (songCard) {
                    likedSongsContainer.appendChild(songCard);
                }
            }
        });
        
        // Adicionar animações aos cards
        animateCards(likedSongsContainer);
    }
}

// Encontrar uma música no banco de dados por título e artista
function findSongByInfo(songInfo) {
    // Encontrar a música no banco de dados
    return musicDatabase.find(song => 
        song.title && song.artist &&
        song.title.toLowerCase().includes(songInfo.title.toLowerCase()) && 
        song.artist.toLowerCase().includes(songInfo.artist.toLowerCase())
    );
}

// Criar card de música usando o formato padrão (musica.grid-cards-item)
function createMusicCard(song, index) {
    if (!song || !song.title) return null;
    
    // Placeholder que será ajustado pela função normalizePath
    let thumbnailPath = normalizePath('assets/thumbnails/default.jpg');
    
    const card = document.createElement('div');
    card.className = 'musica grid-cards-item';
    card.setAttribute('data-id', song.id);
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <div class="blur"></div>
        <div class="image-container">
            <img src="${thumbnailPath}" alt="${song.title}" class="foto" data-id="${song.id}">
        </div>
        <div class="textos">
            <h3 class="titulo-da-musica">${song.title}</h3>
            <div class="detalhes">
                <span class="tipo-item">Música</span>
                <span class="artista-nome">${song.artist || 'Artista Desconhecido'}</span>
            </div>
        </div>
    `;
    
    // Adicionar evento de clique para reproduzir a música
    card.addEventListener('click', () => {
        if (typeof playSong === 'function') {
            playSong(song.id);
        } else {
            console.warn('Função playSong não disponível');
        }
    });
    
    // Carregar a thumbnail real de maneira assíncrona
    if (typeof window.musicManager !== 'undefined' && typeof window.musicManager.getThumbnail === 'function') {
        window.musicManager.getThumbnail(song).then(thumbnail => {
            const img = card.querySelector(`img[data-id="${song.id}"]`);
            if (img) img.src = thumbnail;
        }).catch(error => {
            console.warn('Erro ao carregar thumbnail:', error);
        });
    } else if (song.thumbnail) {
        // Fallback se musicManager não estiver disponível
        const img = card.querySelector(`img[data-id="${song.id}"]`);
        if (img) img.src = normalizePath(song.thumbnail);
    }
    
    return card;
}

// Buscar uma música pelo ID
function getSongById(id) {
    return typeof musicDatabase !== 'undefined' 
        ? musicDatabase.find(song => song.id === id) 
        : null;
}

// Função para normalizar caminhos de arquivo
function normalizePath(path) {
    if (!path) return normalizePath('assets/thumbnails/default.jpg');
    
    // Se o caminho já começar com http ou data:, é uma URL ou base64, retorne como está
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }
    
    // Ajustar caminhos relativos
    if (path.startsWith('../')) {
        path = path.substring(3); // Remove o '../' do início
    }
    
    // Se estivermos na pasta pages/, ajustar o caminho para o public
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    
    // Se o caminho já começa com public/ ou assets/, verificar se estamos em pages/
    if (path.startsWith('public/') || path.startsWith('assets/')) {
        if (isInPagesDirectory && !path.startsWith('../')) {
            return '../' + path;
        }
        return path;
    }
    
    // Se o caminho não começa com public/ ou assets/, adicionar o prefixo correto
    if (isInPagesDirectory) {
        return '../public/' + path;
    }
    
    return 'public/' + path;
}

// Inicializar a funcionalidade de pesquisa na biblioteca
function initBibliotecaSearch() {
    const searchInput = document.querySelector('.barra-pesquisa-biblioteca input');
    if (!searchInput) return;
    
    // Criar contêiner para resultados se não existir
    let resultsContainer = document.querySelector('.resultados-pesquisa');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'resultados-pesquisa';
        resultsContainer.style.display = 'none';
        searchInput.parentNode.appendChild(resultsContainer);
    }
    
    // Adicionar evento de entrada
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        // Pesquisar no banco de dados de música
        const results = searchMusic(query);
        
        // Exibir resultados
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="sem-resultados">Nenhum resultado encontrado</div>';
        } else {
            // Limpar resultados anteriores
            resultsContainer.innerHTML = '';
            
            // Limitar a 8 resultados
            results.slice(0, 8).forEach(song => {
                // Placeholder que será ajustado pela função normalizePath
                const placeholderThumbnail = normalizePath('assets/thumbnails/default.jpg');
                
                const resultItem = document.createElement('div');
                resultItem.className = 'resultado-item';
                resultItem.setAttribute('data-id', song.id);
                
                resultItem.innerHTML = `
                    <img src="${placeholderThumbnail}" alt="${song.title}" data-id="${song.id}-search">
                    <div class="resultado-info">
                        <div class="resultado-titulo">${song.title}</div>
                        <div class="resultado-artista">${song.artist}</div>
                    </div>
                `;
                
                // Carregar thumbnail real
                if (typeof window.musicManager !== 'undefined' && typeof window.musicManager.getThumbnail === 'function') {
                    window.musicManager.getThumbnail(song).then(thumbnail => {
                        const img = resultItem.querySelector(`img[data-id="${song.id}-search"]`);
                        if (img) img.src = thumbnail;
                    }).catch(error => {
                        console.warn('Erro ao carregar thumbnail na busca:', error);
                    });
                } else if (song.thumbnail) {
                    // Fallback
                    const img = resultItem.querySelector(`img[data-id="${song.id}-search"]`);
                    if (img) img.src = normalizePath(song.thumbnail);
                }
                
                // Adicionar evento de clique para reproduzir a música
                resultItem.addEventListener('click', function() {
                    if (typeof playSong === 'function') {
                        playSong(song.id);
                        // Fechar os resultados após a seleção
                        resultsContainer.style.display = 'none';
                        searchInput.value = '';
                    }
                });
                
                resultsContainer.appendChild(resultItem);
            });
        }
        
        // Exibir o contêiner de resultados
        resultsContainer.style.display = 'block';
    });
    
    // Esconder os resultados ao clicar fora da barra de pesquisa
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.barra-pesquisa-biblioteca')) {
            resultsContainer.style.display = 'none';
        }
    });
    
    // Esconder resultados ao pressionar ESC
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            resultsContainer.style.display = 'none';
            this.value = '';
        }
    });
}

// Função para pesquisar músicas
function searchMusic(query) {
    if (!musicDatabase) return [];
    
    // Se temos a função searchSongs do musicManager, usá-la
    if (typeof window.musicManager !== 'undefined' && typeof window.musicManager.searchSongs === 'function') {
        return window.musicManager.searchSongs(query);
    }
    
    // Caso contrário, usar nossa própria implementação
    return musicDatabase.filter(song => 
        (song.title && song.title.toLowerCase().includes(query)) ||
        (song.artist && song.artist.toLowerCase().includes(query)) ||
        (song.album && song.album.toLowerCase().includes(query))
    );
}

// Animar os cards após a renderização
function animateCards(container) {
    if (!container) return;
    
    const cards = container.querySelectorAll('.playlist-card, .musica.grid-cards-item');
    
    cards.forEach((card, index) => {
        // Definir estilo inicial
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Aplicar a animação com atraso
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Inicializar o player com a música "Timeless"
function initSpecificSong() {
    // Procurar por uma música chamada "Timeless" no banco de dados
    const timelessSong = musicDatabase.find(song => 
        song.title && song.title.toLowerCase().includes('timeless') &&
        song.artist && song.artist.toLowerCase().includes('weeknd')
    );
    
    // Se encontrarmos a música, definir no player
    if (timelessSong && typeof playSong === 'function') {
        // Apenas atualizar a interface do player sem reproduzir
        updatePlayerUI(timelessSong);
    } else {
        console.log('Música "Timeless" não encontrada ou função playSong não disponível');
    }
}

// Atualizar a interface do player sem reproduzir a música
function updatePlayerUI(song) {
    if (!song) return;
    
    // Atualizar elementos da interface do player
    const songNameElement = document.querySelector('.player-song-name');
    const artistNameElement = document.querySelector('.player-artist-name');
    const thumbnailElement = document.querySelector('.player-song-info img');
    const timeElement = document.querySelector('.player-time');
    
    if (songNameElement) songNameElement.textContent = song.title || 'Timeless';
    if (artistNameElement) artistNameElement.textContent = song.artist || 'The Weeknd e Playboi Carti';
    
    // Atualizar a miniatura
    if (thumbnailElement) {
        if (typeof window.musicManager !== 'undefined' && typeof window.musicManager.getThumbnail === 'function') {
            window.musicManager.getThumbnail(song).then(thumbnail => {
                thumbnailElement.src = thumbnail;
            }).catch(error => {
                console.warn('Erro ao carregar thumbnail do player:', error);
            });
        } else if (song.thumbnail) {
            thumbnailElement.src = normalizePath(song.thumbnail);
        }
    }
    
    // Atualizar a barra de progresso para mostrar algum progresso
    const progressBar = document.querySelector('.player-progress');
    if (progressBar) {
        progressBar.style.width = '15%'; // Aproximadamente 0:27 de 2:57
    }
    
    // Certificar que o tempo está definido corretamente
    if (timeElement) {
        timeElement.textContent = '0:27 / 2:57';
    }
}

// Configurar listener para evento de favoritos
function setupFavoritesListener() {
    // Verificar se estamos na página da biblioteca
    if (!document.getElementById('musicas-curtidas')) return;
    
    // Adicionar evento para monitorar mudanças nos botões de like/dislike do player
    document.addEventListener('click', function(e) {
        const likeButton = e.target.closest('.player-button[title="Gostei"]');
        const dislikeButton = e.target.closest('.player-button[title="Não gostei"]');
        
        if (likeButton || dislikeButton) {
            // Recarregar a seção de músicas curtidas após um breve atraso
            // para garantir que o localStorage já foi atualizado
            setTimeout(() => {
                loadLikedSongsSection();
            }, 100);
        }
    });
    
    // Monitorar mudanças no localStorage (caso outro componente altere os favoritos)
    window.addEventListener('storage', function(e) {
        if (e.key === 'nurvaFavorites') {
            console.log('Detectada alteração no localStorage para nurvaFavorites');
            loadLikedSongsSection();
        }
    });
    
    // Criar e registrar um evento personalizado para sincronização entre páginas
    if (typeof window.addEventListener === 'function') {
        // Registrar evento personalizado para sincronização
        document.addEventListener('nurvaLikesUpdated', function() {
            console.log('Evento nurvaLikesUpdated recebido, recarregando músicas curtidas...');
            loadLikedSongsSection();
        });
    }
} 