// Explorar.js - Responsável pela funcionalidade da página de exploração

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de exploração...');
    
    // Verificar se o banco de dados de música está disponível
    if (typeof musicDatabase === 'undefined' || !musicDatabase) {
        console.error('Banco de dados de música não disponível');
        setTimeout(() => {
            if (typeof musicDatabase !== 'undefined' && musicDatabase) {
                initExplorarPage();
            } else {
                showErrorMessage('Não foi possível carregar o conteúdo musical. Tente recarregar a página.');
            }
        }, 1000);
        return;
    }
    
    // Verificar disponibilidade do musicManager para diagnósticos
    if (typeof window.musicManager !== 'undefined') {
        console.log('musicManager disponível. Verificando funções de gerenciamento de thumbnails...');
        if (typeof window.musicManager.getThumbnail === 'function') {
            console.log('Função getThumbnail está disponível');
        } else {
            console.warn('Função getThumbnail não está disponível!');
        }
        
        // Verificar integridade do banco de dados (apenas para diagnóstico)
        if (typeof window.musicManager.checkDatabaseIntegrity === 'function') {
            window.musicManager.checkDatabaseIntegrity()
                .then(result => {
                    if (!result.status) {
                        console.warn('Problemas encontrados no banco de dados:');
                        if (result.thumbnailIssues && result.thumbnailIssues.length > 0) {
                            console.warn(`${result.thumbnailIssues.length} problemas com thumbnails`);
                        }
                    }
                })
                .catch(err => console.error('Erro ao verificar integridade:', err));
        }
    } else {
        console.warn('musicManager não está disponível. Usando fallbacks para carregamento de thumbnails.');
    }
    
    initExplorarPage();
});

// Inicializar a página de exploração
function initExplorarPage() {
    console.log('Carregando conteúdo da página de exploração...');
    
    // Inicializar seções principais
    loadExploreSection();
    loadTrendingSection();
    
    // Inicializar os filtros de gênero
    initGenreFilters();
    
    // Inicializar pesquisa adicional específica para a página de exploração
    initExplorarSearch();
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

// Carregar a seção "Explore novos mares"
function loadExploreSection() {
    const exploreContainer = document.getElementById('explore-novos-mares');
    if (!exploreContainer) return;
    
    exploreContainer.innerHTML = ''; // Limpar conteúdo existente
    
    // Obter recomendações personalizadas com base nas músicas mais tocadas
    const recommendations = getPersonalizedRecommendations();
    
    // Renderizar os itens na grade
    renderItems(recommendations, exploreContainer);
    
    // Inicializar carrossel se necessário
    initializeCarousel(exploreContainer.closest('.secao-explorar'));
}

// Carregar a seção "Em alta no momento"
function loadTrendingSection() {
    const trendingContainer = document.getElementById('em-alta-no-momento');
    if (!trendingContainer) return;
    
    trendingContainer.innerHTML = ''; // Limpar conteúdo existente
    
    // Obter músicas em alta
    const trendingSongs = getTrendingSongs();
    
    // Renderizar os itens na grade
    renderLargeItems(trendingSongs, trendingContainer);
}

// Obter recomendações personalizadas com base no histórico de reprodução
function getPersonalizedRecommendations() {
    // Verificar se temos playlists no localStorage
    let userPreferences = {
        genres: [],
        artists: [],
        recentlyPlayed: []
    };
    
    // Tentar obter playlists do localStorage
    try {
        if (typeof window.playlists !== 'undefined' && window.playlists.recentlyPlayed) {
            userPreferences.recentlyPlayed = window.playlists.recentlyPlayed
                .map(id => window.musicManager.getSongById(id))
                .filter(Boolean);
                
            // Extrair gêneros e artistas das músicas recentes
            userPreferences.recentlyPlayed.forEach(song => {
                if (song.genre && !userPreferences.genres.includes(song.genre)) {
                    userPreferences.genres.push(song.genre);
                }
                
                if (song.artist) {
                    song.artist.split(',').map(a => a.trim()).forEach(artist => {
                        if (!userPreferences.artists.includes(artist)) {
                            userPreferences.artists.push(artist);
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.warn('Erro ao carregar preferências do usuário:', e);
    }
    
    // Preparar itens para recomendação
    const recommendations = [];
    
    // 1. Adicionar músicas de artistas favoritos
    if (userPreferences.artists.length > 0) {
        userPreferences.artists.forEach(artist => {
            const artistSongs = musicDatabase.filter(song => 
                song.artist && song.artist.toLowerCase().includes(artist.toLowerCase())
            );
            
            // Filtrar para não incluir músicas já ouvidas recentemente
            const newSongs = artistSongs.filter(song => 
                !userPreferences.recentlyPlayed.some(played => played.id === song.id)
            );
            
            // Adicionar até 2 músicas de cada artista
            if (newSongs.length > 0) {
                recommendations.push(...shuffleArray(newSongs).slice(0, 2));
            }
        });
    }
    
    // 2. Adicionar músicas de gêneros favoritos
    if (userPreferences.genres.length > 0) {
        userPreferences.genres.forEach(genre => {
            const genreSongs = musicDatabase.filter(song => song.genre === genre);
            
            // Filtrar músicas já adicionadas ou ouvidas recentemente
            const newGenreSongs = genreSongs.filter(song => 
                !recommendations.some(r => r.id === song.id) && 
                !userPreferences.recentlyPlayed.some(played => played.id === song.id)
            );
            
            // Adicionar até 3 músicas de cada gênero
            if (newGenreSongs.length > 0) {
                recommendations.push(...shuffleArray(newGenreSongs).slice(0, 3));
            }
        });
    }
    
    // 3. Se ainda não temos recomendações suficientes, adicionar músicas populares
    if (recommendations.length < 16) {
        const popularSongs = getPopularSongs(16 - recommendations.length);
        
        // Filtrar músicas já adicionadas
        const newPopularSongs = popularSongs.filter(song => 
            !recommendations.some(r => r.id === song.id)
        );
        
        recommendations.push(...newPopularSongs);
    }
    
    // Embaralhar e limitar a 16 itens
    return shuffleArray(recommendations).slice(0, 16).map(song => ({
        type: 'music',
        data: song
    }));
}

// Obter músicas populares/em alta
function getTrendingSongs() {
    // Em uma implementação real, isso poderia vir de dados de streaming ou análise de popularidade
    // Aqui, vamos simular com uma seleção de músicas específicas
    
    // Selecionar músicas que representam as mostradas na imagem de referência
    const specificSongs = [
        { title: "Lover Is a Day", artist: "Cuco" },
        { title: "Balling", artist: "Roddy Ricch" },
        { title: "Too Many Nights", artist: "Metro Boomin" },
        { title: "Werewolf", artist: "Lil Uzi Vert" },
        { title: "Die For You", artist: "The Weeknd" }
    ];
    
    // Encontrar correspondências no banco de dados
    const trendingSongs = [];
    
    specificSongs.forEach(specific => {
        // Procurar a música pelo título e artista
        const found = musicDatabase.find(song => 
            song.title && song.artist &&
            song.title.toLowerCase().includes(specific.title.toLowerCase()) && 
            song.artist.toLowerCase().includes(specific.artist.toLowerCase())
        );
        
        if (found) {
            trendingSongs.push({
                type: 'music',
                data: found,
                isLarge: true
            });
        }
    });
    
    // Se não encontrarmos músicas suficientes, completar com músicas aleatórias
    if (trendingSongs.length < 5) {
        const randomSongs = shuffleArray(musicDatabase)
            .slice(0, 5 - trendingSongs.length)
            .map(song => ({
                type: 'music',
                data: song,
                isLarge: true
            }));
        
        trendingSongs.push(...randomSongs);
    }
    
    return trendingSongs;
}

// Renderizar itens na grade (músicas ou artistas)
function renderItems(items, container) {
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    items.forEach((item, index) => {
        const card = item.type === 'music' ? 
            createMusicCard(item.data, index) : 
            createArtistCard(item.data);
        
        if (card) fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
    
    // Adicionar animações com delay
    animateCards(container);
}

// Renderizar itens grandes para a seção "Em alta no momento"
function renderLargeItems(items, container) {
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    items.forEach((item, index) => {
        if (item.type === 'music') {
            const card = createLargeMusicCard(item.data, index);
            if (card) fragment.appendChild(card);
        }
    });
    
    container.appendChild(fragment);
    
    // Adicionar animações com delay
    animateCards(container);
}

// Criar card de música padrão
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

// Criar card de artista
function createArtistCard(artist) {
    if (!artist || !artist.name) return null;
    
    const card = document.createElement('div');
    card.className = 'artista grid-cards-item';
    
    card.innerHTML = `
        <div class="ellipse-1"></div>
        <div class="circulo">
            <img src="${artist.thumbnail || '../public/assets/thumbnails/default.jpg'}" alt="${artist.name}" class="foto-artista">
        </div>
        <h3 class="nome-do-artista">${artist.name}</h3>
        <div class="inscritos">
            <div class="inscritos2">${artist.subscribers || '1M'} inscritos</div>
        </div>
    `;
    
    return card;
}

// Criar card de música grande para a seção "Em alta no momento"
function createLargeMusicCard(song, index) {
    if (!song || !song.title) return null;
    
    // Placeholder que será ajustado pela função normalizePath
    let thumbnailPath = normalizePath('assets/thumbnails/default.jpg');
    
    const card = document.createElement('div');
    card.className = 'musica-grande grid-cards-item';
    card.setAttribute('data-id', song.id);
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <div class="blur"></div>
        <div class="image-container-grande">
            <img src="${thumbnailPath}" alt="${song.title}" class="foto-grande" data-id="${song.id}">
        </div>
        <div class="textos-grande">
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

// Inicializar os filtros de gênero
function initGenreFilters() {
    const filterButtons = document.querySelectorAll('.filtro-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativo de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('ativo'));
            
            // Adicionar classe ativo ao botão clicado
            this.classList.add('ativo');
            
            // Filtrar músicas baseado no gênero selecionado
            const genre = this.textContent.trim();
            filterByGenre(genre);
        });
    });
}

// Filtrar músicas por gênero
function filterByGenre(genre) {
    const exploreContainer = document.getElementById('explore-novos-mares');
    if (!exploreContainer) return;
    
    // Limpar o contêiner
    exploreContainer.innerHTML = '';
    
    let filteredItems = [];
    
    // Para o botão "Para Você", mostrar recomendações personalizadas
    if (genre === 'Para Você') {
        filteredItems = getPersonalizedRecommendations();
    } else {
        // Filtrar músicas pelo gênero selecionado
        const genreMap = {
            'Rock': 'Rock',
            'Hip-Hop': 'Hip Hop',
            'Pop': 'Pop',
            'Jazz': 'Jazz',
            'Reggae': 'Reggae',
            'Eletrônica': 'Electronic',
            'Phonk': 'Phonk'
        };
        
        // Usar o mapeamento ou o texto direto
        const mappedGenre = genreMap[genre] || genre;
        
        // Primeiro tentar corresponder exatamente
        let matchingByGenre = musicDatabase.filter(song => 
            song.genre && song.genre.toLowerCase() === mappedGenre.toLowerCase()
        );
        
        // Se não encontrar correspondências exatas, tentar correspondências parciais
        if (matchingByGenre.length === 0) {
            matchingByGenre = musicDatabase.filter(song => 
                song.genre && song.genre.toLowerCase().includes(mappedGenre.toLowerCase())
            );
        }
        
        // Limitar a quantidade e converter para o formato de item
        filteredItems = shuffleArray(matchingByGenre)
            .slice(0, 16)
            .map(song => ({ type: 'music', data: song }));
        
        // Se ainda não temos itens suficientes, adicionar algumas músicas aleatórias
        if (filteredItems.length < 8) {
            const randomSongs = shuffleArray(musicDatabase)
                .slice(0, 16 - filteredItems.length)
                .map(song => ({ type: 'music', data: song }));
            
            filteredItems.push(...randomSongs);
        }
    }
    
    // Renderizar os itens filtrados
    renderItems(filteredItems, exploreContainer);
    
    // Reinicializar carrossel, se necessário
    initializeCarousel(exploreContainer.closest('.secao-explorar'));
}

// Inicializar a funcionalidade de pesquisa especial para a página de exploração
function initExplorarSearch() {
    const searchInput = document.querySelector('.barra-pesquisa-explorar input');
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
        if (!event.target.closest('.barra-pesquisa-explorar')) {
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

// Inicializar carrossel para navegação horizontal
function initializeCarousel(sectionElement) {
    if (!sectionElement) return;
    
    const carousel = sectionElement.querySelector('.grid-cards');
    if (!carousel || carousel.children.length === 0) return;
    
    // Verificar se já existem botões de navegação
    if (sectionElement.querySelector('.navigation-indicator')) return;
    
    // Criar botões de navegação
    const prevButton = document.createElement('div');
    prevButton.className = 'navigation-indicator nav-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('div');
    nextButton.className = 'navigation-indicator nav-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Adicionar botões à seção
    sectionElement.appendChild(prevButton);
    sectionElement.appendChild(nextButton);
    
    // Definir visibilidade inicial
    const needsScroll = carousel.scrollWidth > carousel.offsetWidth;
    prevButton.style.opacity = '0';
    nextButton.style.opacity = needsScroll ? '1' : '0';
    
    // Adicionar eventos de clique
    nextButton.addEventListener('click', () => {
        carousel.scrollBy({ left: carousel.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    prevButton.addEventListener('click', () => {
        carousel.scrollBy({ left: -carousel.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    // Atualizar visibilidade dos botões ao rolar
    carousel.addEventListener('scroll', () => {
        const isAtStart = carousel.scrollLeft < 10;
        const isAtEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 10;
        
        prevButton.style.opacity = isAtStart ? '0.3' : '1';
        nextButton.style.opacity = isAtEnd ? '0.3' : '1';
    });
    
    // Mostrar/esconder botões ao passar o mouse
    sectionElement.addEventListener('mouseenter', () => {
        if (carousel.scrollWidth > carousel.offsetWidth) {
            prevButton.style.opacity = carousel.scrollLeft < 10 ? '0.3' : '1';
            nextButton.style.opacity = 
                carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 10 ? '0.3' : '1';
        }
    });
    
    sectionElement.addEventListener('mouseleave', () => {
        prevButton.style.opacity = '0';
        nextButton.style.opacity = '0';
    });
}

// Animar os cards após a renderização
function animateCards(container) {
    if (!container) return;
    
    const cards = container.querySelectorAll('.grid-cards-item');
    
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

// Obter músicas populares
function getPopularSongs(count) {
    // Em uma implementação real, isso viria de uma API ou de dados de streaming
    // Aqui, vamos simular o comportamento
    
    // Tentar encontrar músicas específicas como na imagem
    const specificSongTitles = [
        "Fell In Luv", "Family Ties", "Ric Flair Drip", "Revenge",
        "FEIN", "Hot", "Space Cadet", "New Tank", 
        "New Person, Same old Mistakes", "Lucid Dreams", "Come As You Are", "Blue Hair"
    ];
    
    const specificSongs = [];
    
    // Encontrar correspondências no banco de dados
    specificSongTitles.forEach(title => {
        const match = musicDatabase.find(song => 
            song.title && song.title.toLowerCase().includes(title.toLowerCase())
        );
        
        if (match) specificSongs.push(match);
    });
    
    // Se encontramos músicas suficientes, retornar
    if (specificSongs.length >= count) {
        return specificSongs.slice(0, count);
    }
    
    // Caso contrário, completar com músicas aleatórias
    const remainingSongs = count - specificSongs.length;
    const randomSongs = shuffleArray(
        musicDatabase.filter(song => !specificSongs.some(s => s.id === song.id))
    ).slice(0, remainingSongs);
    
    return [...specificSongs, ...randomSongs];
}

// Função para embaralhar um array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Função para normalizar caminhos de arquivos
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