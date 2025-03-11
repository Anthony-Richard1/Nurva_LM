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