// Funcionalidades principais do site

document.addEventListener('DOMContentLoaded', function() {
    // Definir a altura do menu mobile como variável CSS para uso em outros componentes
    const mobileTouchMenu = document.querySelector('.mobile-touch-menu');
    if (mobileTouchMenu) {
        // Definir a altura do menu mobile como variável CSS
        const mobileMenuHeight = mobileTouchMenu.offsetHeight;
        document.documentElement.style.setProperty('--mobile-menu-height', mobileMenuHeight + 'px');
    }

    // Código para o menu responsivo - apenas para a sidebar
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.lateral');
    
    // Adicionar um overlay para quando o menu estiver aberto em dispositivos móveis
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Lógica para abrir e fechar a sidebar
    if (menuIcon && sidebar) {
        menuIcon.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            menuIcon.classList.toggle('active');
        });
    }

    // Fechar o menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuIcon.classList.remove('active');
        }
    });

    // Fechar o menu ao clicar fora dele (em telas menores)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            const isClickInsideMenu = event.target.closest('.lateral') || 
                                     event.target.closest('.menu-icon');
            
            if (!isClickInsideMenu) {
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    menuIcon.classList.remove('active');
                }
            }
        }
    });

    // Marcar o link ativo no menu de navegação
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Marcar links ativos nos menus
    const allMenuLinks = document.querySelectorAll('.menu a, .mobile-touch-menu a');
    
    allMenuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        const linkPageName = linkPage ? linkPage.split('/').pop() : '';
        
        if (linkPage === currentPage || 
            linkPageName === currentPage ||
            (currentPage === 'index.html' && (linkPage === '#' || linkPage === './' || linkPage === '') || 
            linkPage.endsWith('/' + currentPage))) {
            link.classList.add('ativa');
        } else {
            link.classList.remove('ativa');
        }
    });

    // Adicionar funcionalidade de rolagem horizontal suave para o menu touch em dispositivos móveis
    if (mobileTouchMenu) {
        // Rolagem suave com o mouse/touch
        let isDown = false;
        let startX;
        let scrollLeft;

        mobileTouchMenu.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - mobileTouchMenu.offsetLeft;
            scrollLeft = mobileTouchMenu.scrollLeft;
        });

        mobileTouchMenu.addEventListener('mouseleave', () => {
            isDown = false;
        });

        mobileTouchMenu.addEventListener('mouseup', () => {
            isDown = false;
        });

        mobileTouchMenu.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - mobileTouchMenu.offsetLeft;
            const walk = (x - startX) * 2; // Velocidade de rolagem
            mobileTouchMenu.scrollLeft = scrollLeft - walk;
        });

        // Adicionar suporte a eventos de toque para dispositivos móveis
        mobileTouchMenu.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - mobileTouchMenu.offsetLeft;
            scrollLeft = mobileTouchMenu.scrollLeft;
        });

        mobileTouchMenu.addEventListener('touchend', () => {
            isDown = false;
        });

        mobileTouchMenu.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - mobileTouchMenu.offsetLeft;
            const walk = (x - startX) * 2; // Velocidade de rolagem
            mobileTouchMenu.scrollLeft = scrollLeft - walk;
        });

        // Centralizar item ativo no menu touch
        setTimeout(() => {
            const activeItem = mobileTouchMenu.querySelector('a.ativa');
            if (activeItem) {
                const menuWidth = mobileTouchMenu.offsetWidth;
                const itemLeft = activeItem.offsetLeft;
                const itemWidth = activeItem.offsetWidth;
                
                // Centralizar o item ativo
                mobileTouchMenu.scrollLeft = itemLeft - (menuWidth / 2) + (itemWidth / 2);
            }
        }, 100);
    }

    // Atualizar classes responsivas quando a janela for redimensionada
    window.addEventListener('resize', handleResize);
    
    // Executa uma vez na inicialização para configurar tudo corretamente
    handleResize();
    
    // Função para manipular o redimensionamento da janela
    function handleResize() {
        // Fechar menus quando a largura da janela mudar
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuIcon.classList.remove('active');
        }
        
        // Atualizar altura do menu mobile após redimensionamento
        if (mobileTouchMenu) {
            const mobileMenuHeight = mobileTouchMenu.offsetHeight;
            document.documentElement.style.setProperty('--mobile-menu-height', mobileMenuHeight + 'px');
        }
        
        // Adicionar/remover classes com base no tamanho da tela
        updateResponsiveClasses();
        
        // Ajustar o player para telas menores
        updatePlayerForScreenSize();
    }
    
    // Função para atualizar classes responsivas
    function updateResponsiveClasses() {
        const playerButtons = document.querySelectorAll('.player-button');
        
        // Botões que devem ser escondidos em telas médias
        const mediumHideButtons = ['player-random', 'player-repeat', 'player-add'];
        
        // Botões que devem ser escondidos em telas pequenas
        const smallHideButtons = ['player-thumbs-down', 'player-thumbs-up', 'player-volume'];
        
        playerButtons.forEach(button => {
            // Remover todas as classes responsivas para reconfigurá-las
            button.classList.remove('hide-on-medium', 'hide-on-small');
            
            // Obter o ID ou classe para identificar o botão
            const buttonId = button.id || Array.from(button.classList).find(cls => cls.startsWith('player-'));
            
            if (buttonId) {
                // Adicionar classes conforme necessário
                if (mediumHideButtons.includes(buttonId)) {
                    button.classList.add('hide-on-medium');
                }
                
                if (smallHideButtons.includes(buttonId)) {
                    button.classList.add('hide-on-small');
                }
            }
        });
    }
    
    // Função para ajustar o player para diferentes tamanhos de tela
    function updatePlayerForScreenSize() {
        const player = document.querySelector('.player');
        if (!player) return;
        
        // Ajustar dimensões conforme necessário
        if (window.innerWidth <= 576) {
            // Configurações para telas muito pequenas
            // Estas são apenas configurações adicionais específicas
            // O resto acontece via CSS com media queries
        }
    }

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

    // Encontrar links para a biblioteca
    const bibliotecaLinks = document.querySelectorAll('a[href*="biblioteca.html"]');
    
    bibliotecaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Armazenar um marcador de tempo no sessionStorage
            // para que a página da biblioteca saiba que precisa recarregar os dados
            sessionStorage.setItem('nurvaLibraryRefresh', Date.now().toString());
            
            // Também disparar evento para playlists serem atualizadas
            if (typeof window.userPlaylists !== 'undefined') {
                try {
                    document.dispatchEvent(new CustomEvent('nurvaPlaylistsUpdated', { 
                        detail: { playlists: window.userPlaylists }
                    }));
                    console.log('Evento nurvaPlaylistsUpdated disparado antes de navegar para biblioteca');
                } catch (err) {
                    console.error('Erro ao disparar evento de atualização de playlists:', err);
                }
            }
        });
    });
    
    // Adiciona classe "touch" ao body em dispositivos touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
});

// Inicialização do player de música
function initMusicPlayer() {
    const playButton = document.querySelector('.player-play-button');
    const progressBar = document.querySelector('.player-progress');
    const playerButtons = document.querySelectorAll('.player-button');
    
    // Adicionar IDs aos botões do player para identificá-los facilmente
    const buttonTypes = [
        'player-thumbs-down',
        'player-thumbs-up',
        'player-random',
        'player-repeat',
        'player-add',
        'player-volume'
    ];
    
    // Atribuir IDs para cada botão com base na ordem do array acima
    playerButtons.forEach((button, index) => {
        if (index < buttonTypes.length) {
            button.id = buttonTypes[index];
        }
    });
    
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
    
    // Adicionar suporte a gestos de toque para controles do player em dispositivos móveis
    const playerArea = document.querySelector('.player');
    if (playerArea && 'ontouchstart' in window) {
        let touchStartX = 0;
        let touchStartY = 0;
        
        playerArea.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        playerArea.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Ignora gestos verticais (para permitir rolagem da página)
            if (Math.abs(diffY) > Math.abs(diffX)) return;
            
            // Se o gesto for suficientemente longo horizontalmente
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Deslizar para a esquerda - próxima música
                    const nextButton = document.querySelector('.player-button[title="Próxima música"]');
                    if (nextButton) nextButton.click();
                } else {
                    // Deslizar para a direita - música anterior
                    const prevButton = document.querySelector('.player-button[title="Música anterior"]');
                    if (prevButton) prevButton.click();
                }
            }
        });
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
            background-color: rgba(20, 20, 20, 0.95);
            border-radius: 8px;
            margin-top: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
            backdrop-filter: blur(10px);
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
            object-fit: cover;
            border-radius: 4px;
            margin-right: 15px;
        }
        
        .resultado-info {
            flex: 1;
        }
        
        .resultado-titulo {
            color: white;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .resultado-artista {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }
        
        .sem-resultados {
            padding: 20px;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
        
        @media (max-width: 576px) {
            .resultados-pesquisa {
                max-height: 250px;
            }
            
            .resultado-item {
                padding: 8px 12px;
            }
            
            .resultado-item img {
                width: 32px;
                height: 32px;
                margin-right: 10px;
            }
            
            .resultado-titulo {
                font-size: 13px;
            }
            
            .resultado-artista {
                font-size: 11px;
            }
            
            .sem-resultados {
                padding: 15px;
                font-size: 13px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Adicionar estilos ao carregar a página
window.addEventListener('load', function() {
    addSearchStyles();
}); 