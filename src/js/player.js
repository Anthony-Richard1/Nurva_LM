// Player de música integrado com o banco de dados local

// Variáveis globais para o player
let currentSong = null;
let isPlaying = false;
let audioPlayer = new Audio();
let currentPlaylist = [];
let currentIndex = 0;
let shuffleMode = false; // Inicializa como falso
let repeatMode = 0; // 0: sem repetição, 1: repetir playlist, 2: repetir música
let errorRetries = 0; // Contador de tentativas de reprodução

// Inicializar o player
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando o player de música...");
    
    // Configurar o player
    setupPlayer();
    
    // Adicionar eventos ao player de áudio
    setupAudioEvents();
    
    // Criar uma playlist padrão com todas as músicas
    if (typeof musicDatabase !== 'undefined') {
        currentPlaylist = [...musicDatabase];
        console.log(`Playlist padrão criada com ${currentPlaylist.length} músicas`);
    } else {
        console.error("Banco de dados de música não encontrado!");
        // Tentar novamente após um atraso
        setTimeout(() => {
            if (typeof musicDatabase !== 'undefined') {
                currentPlaylist = [...musicDatabase];
                console.log(`Playlist padrão criada com ${currentPlaylist.length} músicas`);
            }
        }, 1000);
    }
});

// Configurar o player
function setupPlayer() {
    console.log("Configurando controles do player...");
    
    // Configurar todos os botões de uma vez, garantindo consistência
    setupPlayerButtons();
    
    // Inicialmente o player está oculto
    const player = document.querySelector('.player');
    if (player) {
        player.classList.remove('active');
    }
}

// Configurar eventos para o objeto Audio
function setupAudioEvents() {
    console.log("Configurando eventos do áudio...");
    
    // Atualizar barra de progresso apenas quando a música estiver tocando
    audioPlayer.addEventListener('timeupdate', function() {
        // Verificação rigorosa para evitar que a barra se mova sem música tocando
        if (isPlaying && currentSong && audioPlayer.duration > 0 && !audioPlayer.paused) {
            updateProgress();
        }
    });
    
    // Ao terminar a música, tocar a próxima apenas se não estiver no modo de repetição
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 2) {
            // Repetir a música atual
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch(e => console.error("Erro ao repetir música:", e));
        } else if (repeatMode === 1) {
            // Repetir playlist
            playNextSong();
        } else {
            // Parar ao final se não estiver em modo de repetição
            isPlaying = false;
            updatePlayerUI();
        }
    });
    
    // Atualizar informações do player quando a música é carregada
    audioPlayer.addEventListener('loadedmetadata', function() {
        if (isPlaying) {
            updateProgress(); // Atualizar tempo e barra de progresso apenas se estiver tocando
        }
        errorRetries = 0; // Resetar contador de tentativas quando a música carrega com sucesso
    });
    
    // Lidar com erros
    audioPlayer.addEventListener('error', function(e) {
        console.error("Erro ao reproduzir áudio:", e);
        
        // Tentar reproduzir novamente a mesma música até 3 vezes
        if (errorRetries < 3 && currentSong) {
            errorRetries++;
            console.log(`Tentativa ${errorRetries} de reproduzir a música`);
            
            setTimeout(() => {
                audioPlayer.src = currentSong.audioPath;
                audioPlayer.load();
                audioPlayer.play().catch(err => {
                    console.error("Falha na tentativa:", err);
                });
            }, 1000);
        } else {
            alert("Não foi possível reproduzir esta música. Tentando a próxima...");
            playNextSong();
        }
    });
}

// Tocar uma música pelo ID - versão robusta
function playSong(id) {
    console.log(`Tentando reproduzir música com ID: ${id}`);
    
    if (!musicDatabase) {
        console.error("Banco de dados de música não encontrado");
        return;
    }
    
    // Buscar a música no banco de dados
    const song = getSongById(id);
    
    if (!song) {
        console.error(`Música com ID ${id} não encontrada`);
        return;
    }
    
    // Se já estiver tocando esta música, apenas alternar play/pause
    if (currentSong && currentSong.id === song.id) {
        togglePlay();
        return;
    }
    
    console.log(`Reproduzindo: ${song.title} - ${song.artist}`);
    
    // Primeiro pause qualquer música atual
    if (isPlaying) {
        audioPlayer.pause();
    }
    
    // Atualizar a música atual e índice
    currentSong = song;
    currentIndex = currentPlaylist.findIndex(s => s.id === song.id);
    
    // Resetar contador de tentativas
    errorRetries = 0;
    
    // Atualizar o src do player - garantir que o caminho esteja correto
    let audioPath = song.audioPath;
    
    // Verificar se o caminho está correto
    if (audioPath && !audioPath.startsWith('http')) {
        // Ajustar caminho se necessário
        const isInSubdirectory = window.location.pathname.includes('/pages/');
        if (isInSubdirectory && audioPath.startsWith('public/')) {
            audioPath = '../' + audioPath;
        }
    }
    
    // Definir src e carregar áudio
    audioPlayer.src = audioPath;
    audioPlayer.load();
    
    // Primeira atualização da UI para mostrar qual música está carregando
    isPlaying = false; // Ainda não está tocando
    updatePlayerUI();
    
    // Adicionar à lista de reprodução recente (se a função existir)
    if (typeof addToRecentlyPlayed === 'function') {
        addToRecentlyPlayed(song.id);
    }
    
    // Adicionar evento de carregamento único para tocar quando estiver pronto
    const canPlayHandler = function() {
        // Remover o handler para não executar múltiplas vezes
        audioPlayer.removeEventListener('canplaythrough', canPlayHandler);
    
    // Tocar a música
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
            isPlaying = true;
            updatePlayerUI();
                
                // Se o documento tiver título, atualizá-lo com a música atual
                if (document.title) {
                    document.title = `${song.title} - ${song.artist} | Nurva Music`;
                }
            }).catch(err => {
            console.error("Erro ao iniciar reprodução:", err);
                isPlaying = false;
                updatePlayerUI();
            
            if (err.name === 'NotAllowedError') {
                alert("A reprodução automática foi bloqueada pelo navegador. Clique no botão play para começar.");
                }
            });
        } else {
            // Fallback para navegadores que não suportam a Promise de play()
            try {
                isPlaying = true;
                updatePlayerUI();
            } catch (error) {
                console.error("Erro ao iniciar reprodução:", error);
                isPlaying = false;
                updatePlayerUI();
            }
        }
    };
    
    // Adicionar handler para carregar e tocar
    audioPlayer.addEventListener('canplaythrough', canPlayHandler, { once: true });
    
    // Definir um tempo limite para iniciar a reprodução caso o evento canplaythrough não seja disparado
    const timeout = setTimeout(() => {
        audioPlayer.removeEventListener('canplaythrough', canPlayHandler);
        
        // Tentar reproduzir mesmo assim
        try {
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updatePlayerUI();
                }).catch(err => {
                    console.error("Erro ao iniciar reprodução (timeout):", err);
                    isPlaying = false;
                    updatePlayerUI();
                });
            } else {
                isPlaying = true;
                updatePlayerUI();
            }
        } catch (error) {
            console.error("Erro ao iniciar reprodução (timeout):", error);
            isPlaying = false;
            updatePlayerUI();
        }
    }, 3000); // 3 segundos de timeout
    
    // Limpar o timeout se o evento for disparado
    audioPlayer.addEventListener('canplaythrough', () => {
        clearTimeout(timeout);
    }, { once: true });
}

// Atualizar a interface do player com as informações da música atual
function updatePlayerUI() {
    if (!currentSong) return;
    
    console.log("Atualizando interface do player");
    
    // Ativar o player (torná-lo visível) apenas se houver uma música selecionada
    const player = document.querySelector('.player');
    if (player) {
        player.classList.add('active');
        console.log("Adicionada classe 'active' ao player - ele deve estar visível agora");
    } else {
        console.warn("Elemento .player não encontrado no DOM!");
    }
    
    // Determinar o prefixo de caminho com base na página atual
    const isInSubdirectory = window.location.pathname.includes('/pages/');
    const pathPrefix = isInSubdirectory ? '../' : '';
    
    // Atualizar informações da música
    const songTitle = document.querySelector('.player-song-name');
    const artistName = document.querySelector('.player-artist-name');
    const songImage = document.querySelector('.player-song-info img');
    
    if (songImage) {
        // Ajustar o caminho da imagem com base na localização da página
        if (currentSong.thumbnail) {
            let thumbnailPath = currentSong.thumbnail;
            // Se começar com "public/" e estivermos na página principal, não precisa ajustar
            // Se começar com "public/" e estivermos em subdiretório, adiciona "../"
            if (thumbnailPath.startsWith('public/') && isInSubdirectory) {
                thumbnailPath = '../' + thumbnailPath;
            }
            songImage.src = thumbnailPath;
        } else {
            songImage.src = pathPrefix + 'public/assets/thumbnails/default.jpg';
        }
    }
    
    if (songTitle) songTitle.textContent = currentSong.title;
    if (artistName) artistName.textContent = currentSong.artist;
    
    // Atualizar o botão de play/pause
    const playBtn = document.querySelector('.player-play-button');
    if (playBtn) {
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // Atualizar o botão de modo aleatório
    const shuffleBtn = document.querySelector('.player-button[title="Modo aleatório"]');
    if (shuffleBtn) {
        if (shuffleMode) {
            shuffleBtn.classList.add('active');
            shuffleBtn.style.color = '#FFFFFF';
        } else {
            shuffleBtn.classList.remove('active');
            shuffleBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
    
    // Atualizar o botão de repetição
    const repeatBtn = document.querySelector('.player-button[title="Repetir"]');
    if (repeatBtn) {
        // Limpar classes anteriores
        repeatBtn.classList.remove('active', 'repeat-one');
        
        if (repeatMode === 0) {
            // Sem repetição - cor normal
            repeatBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        } else if (repeatMode === 1) {
            // Repetir playlist - ativar
            repeatBtn.classList.add('active');
            repeatBtn.style.color = '#FFFFFF';
        } else if (repeatMode === 2) {
            // Repetir música - ativar e adicionar classe especial
            repeatBtn.classList.add('active', 'repeat-one');
            repeatBtn.style.color = '#FFFFFF';
        }
    }
    
    // Atualizar os botões de like/dislike
    updateLikeDislikeButtons();
    
    // Atualizar a minutagem e barra de progresso
    updateProgress();
    
    // Destacar a música atual na lista
    document.querySelectorAll('.musica').forEach(card => {
        const cardId = parseInt(card.getAttribute('data-id'));
        
        if (cardId === currentSong.id) {
            card.classList.add('playing');
        } else {
            card.classList.remove('playing');
        }
    });
}

// Play/pause
function togglePlay() {
    if (!currentSong) {
        // Se não houver música selecionada, tocar a primeira da playlist
        if (currentPlaylist && currentPlaylist.length > 0) {
            playSong(currentPlaylist[0].id);
        }
        return;
    }
    
    try {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
            const playPromise = audioPlayer.play();
            
            // Lidar com a Promise retornada por play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                    })
                    .catch(error => {
                        console.error("Erro ao iniciar reprodução:", error);
                        isPlaying = false;
                    });
            } else {
        isPlaying = true;
            }
    }
    
    updatePlayerUI();
    } catch (error) {
        console.error("Erro ao alternar reprodução:", error);
    }
}

// Tocar a próxima música
function playNextSong() {
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    
    let nextIndex;
    
    if (shuffleMode) {
        // Modo aleatório: selecionar uma música aleatória diferente da atual
        do {
            nextIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (nextIndex === currentIndex && currentPlaylist.length > 1);
    } else {
        // Modo sequencial: selecionar a próxima música na ordem
        nextIndex = (currentIndex + 1) % currentPlaylist.length;
    }
    
    playSong(currentPlaylist[nextIndex].id);
}

// Tocar a música anterior
function playPrevSong() {
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    
    let prevIndex;
    
    if (shuffleMode) {
        // Modo aleatório: selecionar uma música aleatória diferente da atual
        do {
            prevIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (prevIndex === currentIndex && currentPlaylist.length > 1);
    } else {
        // Modo sequencial: selecionar a música anterior na ordem
        prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }
    
    playSong(currentPlaylist[prevIndex].id);
}

// Ativar/desativar modo aleatório
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    console.log(`Modo aleatório: ${shuffleMode ? 'Ativado' : 'Desativado'}`);
    
    // Atualizar o botão visualmente
    const shuffleBtn = document.querySelector('.player-button[title="Modo aleatório"]');
    if (shuffleBtn) {
        if (shuffleMode) {
            shuffleBtn.classList.add('active');
            shuffleBtn.style.color = '#FFFFFF';
        } else {
            shuffleBtn.classList.remove('active');
            shuffleBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
}

// Ciclar entre os modos de repetição
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    
    // Mensagens de log mais descritivas
    const modos = ['Desativado', 'Repetir playlist', 'Repetir música atual'];
    console.log(`Modo de repetição: ${modos[repeatMode]}`);
    
    // Atualizar o botão visualmente
    const repeatBtn = document.querySelector('.player-button[title="Repetir"]');
    if (repeatBtn) {
        // Limpar classes anteriores
        repeatBtn.classList.remove('active', 'repeat-one');
        
        if (repeatMode === 0) {
            // Sem repetição - cor normal
            repeatBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        } else if (repeatMode === 1) {
            // Repetir playlist - ativar
            repeatBtn.classList.add('active');
            repeatBtn.style.color = '#FFFFFF';
        } else if (repeatMode === 2) {
            // Repetir música - ativar e adicionar classe especial
            repeatBtn.classList.add('active', 'repeat-one');
            repeatBtn.style.color = '#FFFFFF';
        }
    }
}

// Ajustar o volume (0-1)
function setVolume(volumeLevel) {
    volumeLevel = Math.max(0, Math.min(1, volumeLevel)); // Limitar entre 0 e 1
    audioPlayer.volume = volumeLevel;
    
    // Atualizar a barra de volume visualmente
    const volumeLevelElement = document.querySelector('.player-volume-level');
    if (volumeLevelElement) {
        volumeLevelElement.style.width = `${volumeLevel * 100}%`;
    }
}

// Atualizar a barra de progresso
function updateProgress() {
    // Verificações rigorosas para garantir que a barra só se move quando apropriado
    if (!currentSong || !audioPlayer.duration || audioPlayer.duration === Infinity || audioPlayer.paused || !isPlaying) {
        return;
    }
    
    try {
        // Use valores absolutos para evitar flutuações
        const currentTime = Math.max(0, audioPlayer.currentTime);
        const duration = Math.max(1, audioPlayer.duration); // Evitar divisão por zero
        
        // Limitar o progresso entre 0 e 100%
        const progress = Math.min(100, Math.max(0, (currentTime / duration) * 100));
        
        // Arredondar para evitar mudanças mínimas que causam flickering
        const roundedProgress = Math.floor(progress * 10) / 10;
        
        // Atualizar a barra de progresso
        const progressBar = document.querySelector('.player-progress');
        if (progressBar) {
            progressBar.style.width = `${roundedProgress}%`;
        }
        
        // Atualizar o tempo no formato "atual / total"
        const timeDisplay = document.querySelector('.player-time');
        if (timeDisplay) {
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
    } catch (error) {
        console.error("Erro ao atualizar progresso:", error);
    }
}

// Formatar tempo em minutos:segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Buscar uma música pelo ID
function getSongById(id) {
    return typeof musicDatabase !== 'undefined' 
        ? musicDatabase.find(song => song.id === id) 
        : null;
}

// Adicionar à playlist de favoritos
function addToFavorites(songId) {
    if (!songId || !currentSong) return;
    
    // Verificar se já existe uma lista de favoritos no localStorage
    let favorites = JSON.parse(localStorage.getItem('nurvaFavorites')) || [];
    
    // Verificar se a música já está nos favoritos
    const isAlreadyFavorite = favorites.includes(songId);
    
    if (isAlreadyFavorite) {
        // Se já for favorita, remover dos favoritos
        favorites = favorites.filter(id => id !== songId);
        console.log(`Música ${songId} removida dos favoritos`);
    } else {
        // Se não for favorita, adicionar aos favoritos
        favorites.push(songId);
        console.log(`Música ${songId} adicionada aos favoritos`);
    }
    
    // Salvar no localStorage
    localStorage.setItem('nurvaFavorites', JSON.stringify(favorites));
    
    // Atualizar visual do botão de like
    updateLikeDislikeButtons();
    
    // Disparar evento personalizado para sincronização entre páginas
    try {
        // Criar e disparar evento personalizado para notificar outras partes da aplicação
        const likesUpdatedEvent = new CustomEvent('nurvaLikesUpdated', {
            detail: { favorites: favorites }
        });
        document.dispatchEvent(likesUpdatedEvent);
        console.log('Evento nurvaLikesUpdated disparado após atualização de favoritos');
    } catch (e) {
        console.error('Erro ao disparar evento de atualização de favoritos:', e);
    }
}

// Adicionar à playlist de "não gostei"
function addToDisliked(songId) {
    if (!songId || !currentSong) return;
    
    // Verificar se já existe uma lista de "não gostei" no localStorage
    let disliked = JSON.parse(localStorage.getItem('nurvaDisliked')) || [];
    
    // Verificar se a música já está na lista de "não gostei"
    const isAlreadyDisliked = disliked.includes(songId);
    
    if (isAlreadyDisliked) {
        // Se já estiver na lista, remover
        disliked = disliked.filter(id => id !== songId);
        console.log(`Música ${songId} removida da lista de "não gostei"`);
    } else {
        // Se não estiver na lista, adicionar
        disliked.push(songId);
        console.log(`Música ${songId} adicionada à lista de "não gostei"`);
        
        // Remover dos favoritos se estiver lá
        let favorites = JSON.parse(localStorage.getItem('nurvaFavorites')) || [];
        const wasInFavorites = favorites.includes(songId);
        
        if (wasInFavorites) {
            favorites = favorites.filter(id => id !== songId);
            localStorage.setItem('nurvaFavorites', JSON.stringify(favorites));
            
            // Se removeu dos favoritos, disparar evento
            if (wasInFavorites) {
                try {
                    const likesUpdatedEvent = new CustomEvent('nurvaLikesUpdated', {
                        detail: { favorites: favorites }
                    });
                    document.dispatchEvent(likesUpdatedEvent);
                    console.log('Evento nurvaLikesUpdated disparado após remoção de favoritos via dislike');
                } catch (e) {
                    console.error('Erro ao disparar evento de atualização de favoritos:', e);
                }
            }
        }
    }
    
    // Salvar no localStorage
    localStorage.setItem('nurvaDisliked', JSON.stringify(disliked));
    
    // Atualizar visual dos botões
    updateLikeDislikeButtons();
    
    // Se não gostou, pular para a próxima música
    playNextSong();
}

// Atualizar o visual dos botões de like/dislike
function updateLikeDislikeButtons() {
    if (!currentSong) return;
    
    const songId = currentSong.id;
    const favorites = JSON.parse(localStorage.getItem('nurvaFavorites')) || [];
    const disliked = JSON.parse(localStorage.getItem('nurvaDisliked')) || [];
    
    const likeButton = document.querySelector('.player-button[title="Gostei"]');
    const dislikeButton = document.querySelector('.player-button[title="Não gostei"]');
    
    if (likeButton) {
        if (favorites.includes(songId)) {
            likeButton.classList.add('active');
            likeButton.style.color = '#FFFFFF';
        } else {
            likeButton.classList.remove('active');
            likeButton.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
    
    if (dislikeButton) {
        if (disliked.includes(songId)) {
            dislikeButton.classList.add('active');
            dislikeButton.style.color = '#FFFFFF';
        } else {
            dislikeButton.classList.remove('active');
            dislikeButton.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
}

// Centralizar a configuração de eventos dos botões - nova função para melhor organização
function setupPlayerButtons() {
    const allButtons = {
        play: document.querySelector('.player-play-button'),
        prev: document.querySelector('.player-button[title="Música anterior"]'),
        next: document.querySelector('.player-button[title="Próxima música"]'),
        shuffle: document.querySelector('.player-button[title="Modo aleatório"]'),
        repeat: document.querySelector('.player-button[title="Repetir"]'),
        like: document.querySelector('.player-button[title="Gostei"]'),
        dislike: document.querySelector('.player-button[title="Não gostei"]'),
        addToPlaylist: document.querySelector('.player-button[title="Adicionar à playlist"]'),
        volume: document.querySelector('.player-volume-bar'),
        progress: document.querySelector('.player-progress-container')
    };
    
    // Limpar listeners anteriores para evitar duplicação
    const cloneButtons = {};
    
    // Clonar e substituir cada botão para remover qualquer event listener antigo
    Object.keys(allButtons).forEach(key => {
        if (allButtons[key]) {
            cloneButtons[key] = allButtons[key].cloneNode(true);
            if (allButtons[key].parentNode) {
                allButtons[key].parentNode.replaceChild(cloneButtons[key], allButtons[key]);
            }
            allButtons[key] = cloneButtons[key];
        }
    });
    
    // Adicionar os event listeners nos botões clonados
    if (allButtons.play) {
        allButtons.play.addEventListener('click', togglePlay);
        console.log("Botão de play configurado");
    }
    
    if (allButtons.next) {
        allButtons.next.addEventListener('click', playNextSong);
        console.log("Botão de próxima música configurado");
    }
    
    if (allButtons.prev) {
        allButtons.prev.addEventListener('click', playPrevSong);
        console.log("Botão de música anterior configurado");
    }
    
    if (allButtons.shuffle) {
        allButtons.shuffle.addEventListener('click', toggleShuffle);
        console.log("Botão de modo aleatório configurado");
    }
    
    if (allButtons.repeat) {
        allButtons.repeat.addEventListener('click', toggleRepeat);
        console.log("Botão de repetição configurado");
    }
    
    if (allButtons.like) {
        allButtons.like.addEventListener('click', function() {
            if (currentSong) {
                addToFavorites(currentSong.id);
            }
        });
        console.log("Botão de like configurado");
    }
    
    if (allButtons.dislike) {
        allButtons.dislike.addEventListener('click', function() {
            if (currentSong) {
                addToDisliked(currentSong.id);
            }
        });
        console.log("Botão de dislike configurado");
    }
    
    if (allButtons.volume) {
        allButtons.volume.addEventListener('click', function(e) {
            const volumeBar = this.getBoundingClientRect();
            const volumePercent = (e.clientX - volumeBar.left) / volumeBar.width;
            setVolume(volumePercent);
        });
        console.log("Controle de volume configurado");
    }
    
    if (allButtons.progress) {
        allButtons.progress.addEventListener('click', function(e) {
            if (!currentSong || !audioPlayer.duration) return;
            
            const timeline = this.getBoundingClientRect();
            const seekPercent = (e.clientX - timeline.left) / timeline.width;
            
            audioPlayer.currentTime = audioPlayer.duration * seekPercent;
            updateProgress(); // Atualizar imediatamente após o clique
        });
        console.log("Barra de progresso configurada");
    }
    
    // Configurar o botão de adicionar à playlist (já existente no HTML)
    if (allButtons.addToPlaylist) {
        allButtons.addToPlaylist.addEventListener('click', function() {
            if (currentSong && typeof addCurrentSongToPlaylist === 'function') {
                addCurrentSongToPlaylist();
            } else {
                console.error("Função addCurrentSongToPlaylist não está disponível");
            }
        });
        console.log("Botão de adicionar à playlist configurado");
    }
}

// Adicionar configuração dos botões do player após carregamento - versão revisada
window.addEventListener('load', function() {
    // Usar a função centralizada para configurar os botões
    setupPlayerButtons();
    
    // Iniciar com volume em 70%
    setVolume(0.7);
    
    // Verificar se a música está tocando quando a janela ganha foco (para sincronizar a UI)
    window.addEventListener('focus', function() {
        if (currentSong) {
            isPlaying = !audioPlayer.paused;
            updatePlayerUI();
        }
    });
}); 