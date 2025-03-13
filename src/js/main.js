// Funcionalidades principais do site

document.addEventListener('DOMContentLoaded', function() {
    // Código para o menu responsivo
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.lateral');
    
    if (menuIcon && sidebar) {
        menuIcon.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Fechar o menu ao clicar fora dele (em telas menores)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!event.target.closest('.lateral') && !event.target.closest('.menu-icon')) {
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        }
    });

    // Marcar o link ativo no menu de navegação
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('ativa');
        } else {
            link.classList.remove('ativa');
        }
    });

    // Animações dos cards
    const musicCards = document.querySelectorAll('.musica');
    const artistCards = document.querySelectorAll('.artista');
    
    // Aplicar animações com delay
    musicCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Efeito de clique
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(0)';
            }, 300);
        });
    });
    
    artistCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (musicCards.length + index) * 100);
    });

    // Inicializar o tocador de música
    initMusicPlayer();

    // Inicializar a barra de pesquisa
    initSearchBar();
});

// Inicialização do player de música
function initMusicPlayer() {
    const playButton = document.querySelector('.player-play-button');
    const progressBar = document.querySelector('.player-progress');
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            this.classList.toggle('playing');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('playing')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                // Lógica para tocar a música
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                // Lógica para pausar a música
            }
        });
    }
    
    // Simulação de progresso da música (apenas para demonstração)
    if (progressBar) {
        let width = 0;
        const simulateProgress = setInterval(() => {
            if (width >= 100) {
                clearInterval(simulateProgress);
            } else {
                width += 0.5;
                progressBar.style.width = width + '%';
            }
        }, 1000);
    }
}

// Inicializar a barra de pesquisa
function initSearchBar() {
    const searchInput = document.querySelector('.barra-pesquisa input');
    
    if (!searchInput) {
        console.warn("Barra de pesquisa não encontrada");
        return;
    }
    
    // Criar um elemento para os resultados da pesquisa
    const searchResults = document.createElement('div');
    searchResults.className = 'resultados-pesquisa';
    searchResults.style.display = 'none';
    
    // Adicionar o elemento ao DOM, logo após a barra de pesquisa
    searchInput.parentNode.appendChild(searchResults);
    
    // Adicionar evento de entrada na barra de pesquisa
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        // Verificar se o banco de dados de música está disponível
        if (typeof musicDatabase === 'undefined') {
            searchResults.innerHTML = '<div class="sem-resultados">Banco de dados de música não disponível</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        // Pesquisar no banco de dados
        const results = searchMusic(query);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="sem-resultados">Nenhum resultado encontrado</div>';
        } else {
            // Exibir resultados
            searchResults.innerHTML = '';
            
            // Limitar a 5 resultados para não sobrecarregar a UI
            results.slice(0, 5).forEach(song => {
                const resultItem = document.createElement('div');
                resultItem.className = 'resultado-item';
                resultItem.setAttribute('data-id', song.id);
                
                resultItem.innerHTML = `
                    <img src="${song.thumbnail || 'public/assets/thumbnails/default.jpg'}" alt="${song.title}">
                    <div class="resultado-info">
                        <div class="resultado-titulo">${song.title}</div>
                        <div class="resultado-artista">${song.artist}</div>
                    </div>
                `;
                
                resultItem.addEventListener('click', function() {
                    if (typeof playSong === 'function') {
                        playSong(song.id);
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                    } else {
                        console.error("Função playSong não encontrada");
                    }
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.style.display = 'block';
    });
    
    // Esconder resultados quando clicar fora da barra de pesquisa
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.barra-pesquisa')) {
            searchResults.style.display = 'none';
        }
    });
    
    // Adicionar tecla ESC para fechar os resultados
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            searchResults.style.display = 'none';
            this.value = '';
        }
    });
}

// Função de pesquisa no banco de dados
function searchMusic(query) {
    if (!musicDatabase) return [];
    
    return musicDatabase.filter(song => {
        // Pesquisar pelo título e artista
        return song.title.toLowerCase().includes(query) || 
               song.artist.toLowerCase().includes(query) ||
               (song.album && song.album.toLowerCase().includes(query));
    });
}

// Adicionar estilo para os resultados da pesquisa
function addSearchStyles() {
    // Verificar se o estilo já existe
    if (document.getElementById('search-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'search-styles';
    style.textContent = `
        .resultados-pesquisa {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background: rgba(30, 30, 30, 0.95);
            border-radius: 0 0 10px 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 5px;
        }
        
        .resultado-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .resultado-item:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .resultado-item img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            margin-right: 12px;
            object-fit: cover;
        }
        
        .resultado-info {
            flex: 1;
        }
        
        .resultado-titulo {
            color: white;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 2px;
        }
        
        .resultado-artista {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }
        
        .sem-resultados {
            padding: 15px;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .barra-pesquisa {
            position: relative;
        }
    `;
    
    document.head.appendChild(style);
}

// Adicionar estilos ao carregar a página
window.addEventListener('load', function() {
    addSearchStyles();
}); 