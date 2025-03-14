// Script para página de perfil da Nurva Music

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar comportamentos da página de perfil
    initPerfilPage();
});

/**
 * Inicializa a página de perfil
 */
function initPerfilPage() {
    // Adicionar comportamentos de hover nos cards
    addCardInteractions();
    
    // Inicializar carrosséis para as seções
    initializeCarousels();
    
    // Verificar se o player está tocando (para atualizar UI)
    checkPlayerStatus();
}

/**
 * Adiciona interações aos cards (hover e click)
 */
function addCardInteractions() {
    // Cards de música
    document.querySelectorAll('.musica.grid-cards-item').forEach(card => {
        card.addEventListener('click', function() {
            // Remover classe playing de todos os cards
            document.querySelectorAll('.musica.grid-cards-item.playing').forEach(playingCard => {
                playingCard.classList.remove('playing');
            });
            
            // Adicionar classe playing a este card
            this.classList.add('playing');
            
            // Obter informações da música
            const titulo = this.querySelector('.titulo-da-musica').textContent;
            const artista = this.querySelector('.artista-nome').textContent;
            const thumbnail = this.querySelector('.foto').src;
            const songId = this.getAttribute('data-id');
            
            // Reproduzir a música
            playSongFromCard(songId, titulo, artista, thumbnail);
        });
    });
    
    // Cards de artista
    document.querySelectorAll('.artista.grid-cards-item').forEach(card => {
        card.addEventListener('click', function() {
            // Obter o nome do artista
            const nomeArtista = this.querySelector('.nome-do-artista').textContent;
            
            // Aqui poderia navegar para a página do artista (simulação)
            console.log(`Navegando para a página do artista: ${nomeArtista}`);
            // Mostrar alerta para simulação
            showAlert(`Visitando página de ${nomeArtista}`);
        });
    });
}

/**
 * Inicializa os carrosséis para as seções
 */
function initializeCarousels() {
    const sections = document.querySelectorAll('.secao-artistas, .secao-musicas');
    
    sections.forEach(section => {
        const gridCards = section.querySelector('.grid-cards');
        if (!gridCards || gridCards.children.length === 0) return;
        
        // Verificar se já existem indicadores de navegação
        if (section.querySelector('.navigation-indicator')) return;
        
        // Criar elementos de navegação
        const navPrev = document.createElement('div');
        navPrev.className = 'navigation-indicator nav-prev';
        navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const navNext = document.createElement('div');
        navNext.className = 'navigation-indicator nav-next';
        navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Adicionar elementos ao DOM
        section.appendChild(navPrev);
        section.appendChild(navNext);
        
        // Verificar se é necessário mostrar os controles
        const needsScroll = gridCards.scrollWidth > gridCards.offsetWidth;
        navPrev.style.opacity = '0';
        navNext.style.opacity = needsScroll ? '0.3' : '0';
        
        // Adicionar listeners para navegação
        navNext.addEventListener('click', () => {
            gridCards.scrollBy({ left: gridCards.offsetWidth * 0.8, behavior: 'smooth' });
        });
        
        navPrev.addEventListener('click', () => {
            gridCards.scrollBy({ left: -gridCards.offsetWidth * 0.8, behavior: 'smooth' });
        });
        
        // Atualizar visibilidade dos botões durante o scroll
        const updateNavVisibility = () => {
            if (gridCards.scrollWidth <= gridCards.offsetWidth) {
                navPrev.style.opacity = navNext.style.opacity = '0';
                return;
            }
            
            navPrev.style.opacity = gridCards.scrollLeft > 10 ? '1' : '0.3';
            navNext.style.opacity = 
                gridCards.scrollLeft < gridCards.scrollWidth - gridCards.offsetWidth - 10 ? '1' : '0.3';
        };
        
        // Adicionar eventos para atualizar visibilidade dos botões
        section.addEventListener('mouseenter', updateNavVisibility);
        section.addEventListener('mouseleave', () => {
            navPrev.style.opacity = navNext.style.opacity = '0';
        });
        
        gridCards.addEventListener('scroll', updateNavVisibility);
    });
}

/**
 * Reproduz uma música a partir do card
 */
function playSongFromCard(songId, title, artist, thumbnail) {
    // Atualizar a UI do player
    const songNameElement = document.querySelector('.player-song-name');
    const artistNameElement = document.querySelector('.player-artist-name');
    const thumbnailElement = document.querySelector('.player-song-info img');
    const playButton = document.querySelector('.player-play-button i');
    
    if (songNameElement) songNameElement.textContent = title;
    if (artistNameElement) artistNameElement.textContent = artist;
    if (thumbnailElement) thumbnailElement.src = thumbnail;
    if (playButton) playButton.className = 'fas fa-pause';
    
    // Se existir uma função de player global, chamar
    if (typeof playSong === 'function') {
        try {
            // Se temos um ID, usá-lo diretamente
            if (songId) {
                playSong(songId);
            } else {
                // Caso contrário, tentar encontrar pelo título e artista
                const song = findSongByTitleAndArtist(title, artist);
                if (song && song.id) {
                    playSong(song.id);
                }
            }
        } catch (e) {
            console.log('Reprodução simulada: banco de dados de músicas não disponível');
        }
    }
    
    // Mostrar mensagem
    showAlert(`Reproduzindo: ${title} - ${artist}`);
}

/**
 * Verifica o status do player e atualiza a UI
 */
function checkPlayerStatus() {
    // Verificar se existe uma função de player nas páginas existentes
    if (typeof isPlaying === 'function') {
        updatePlayerUI(isPlaying());
    } else {
        // Se não existir, assumimos que não está tocando
        updatePlayerUI(false);
    }
    
    // Verificar se há uma música tocando (para destacar o card correspondente)
    updateCurrentPlayingCard();
}

/**
 * Atualiza a UI do player
 */
function updatePlayerUI(isPlaying) {
    const playButton = document.querySelector('.player-play-button i');
    if (playButton) {
        playButton.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
}

/**
 * Atualiza o card da música atualmente em reprodução
 */
function updateCurrentPlayingCard() {
    // Se temos uma função para obter o ID da música atual
    if (typeof getCurrentSongId === 'function') {
        try {
            const currentSongId = getCurrentSongId();
            if (currentSongId) {
                // Remover classe playing de todos os cards
                document.querySelectorAll('.musica.grid-cards-item.playing').forEach(card => {
                    card.classList.remove('playing');
                });
                
                // Adicionar classe playing ao card da música atual
                const currentCard = document.querySelector(`.musica.grid-cards-item[data-id="${currentSongId}"]`);
                if (currentCard) {
                    currentCard.classList.add('playing');
                }
            }
        } catch (e) {
            console.log('Não foi possível atualizar o card da música atual');
        }
    }
}

/**
 * Encontra uma música pelo título e artista
 */
function findSongByTitleAndArtist(title, artist) {
    if (typeof musicDatabase !== 'undefined' && Array.isArray(musicDatabase)) {
        return musicDatabase.find(song => 
            song.title.toLowerCase().includes(title.toLowerCase()) && 
            song.artist.toLowerCase().includes(artist.toLowerCase())
        );
    }
    return null;
}

/**
 * Exibe um alerta estilizado
 */
function showAlert(message) {
    // Verificar se já existe um alerta
    const existingAlert = document.querySelector('.nurva-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar o alerta
    const alert = document.createElement('div');
    alert.className = 'nurva-alert';
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(50, 50, 50, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-size: 14px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(alert);
    
    // Animar a entrada
    setTimeout(() => {
        alert.style.opacity = '1';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
} 