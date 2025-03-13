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
    
    // Configurar os eventos dos botões do player
    const playBtn = document.querySelector('.player-play-button');
    const prevBtn = document.querySelector('.player-button[title="Música anterior"]');
    const nextBtn = document.querySelector('.player-button[title="Próxima música"]');
    const shuffleBtn = document.querySelector('.player-button[title="Modo aleatório"]');
    const repeatBtn = document.querySelector('.player-button[title="Repetir"]');
    const volumeContainer = document.querySelector('.player-volume-bar');
    const progressContainer = document.querySelector('.player-progress-container');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
        console.log("Botão de play configurado");
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', playNextSong);
        console.log("Botão de próxima música configurado");
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrevSong);
        console.log("Botão de música anterior configurado");
    }
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', toggleShuffle);
        console.log("Botão de modo aleatório configurado");
    }
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeat);
        console.log("Botão de repetição configurado");
    }
    
    if (volumeContainer) {
        // Configurar o controle de volume
        volumeContainer.addEventListener('click', function(e) {
            const volumeBar = this.getBoundingClientRect();
            const volumePercent = (e.clientX - volumeBar.left) / volumeBar.width;
            setVolume(volumePercent);
        });
        console.log("Controle de volume configurado");
    }
    
    if (progressContainer) {
        // Permitir clique na barra de progresso para avançar/retroceder
        progressContainer.addEventListener('click', function(e) {
            if (!currentSong) return;
            
            const timeline = this.getBoundingClientRect();
            const seekPercent = (e.clientX - timeline.left) / timeline.width;
            
            if (audioPlayer.duration) {
                audioPlayer.currentTime = audioPlayer.duration * seekPercent;
            }
        });
        console.log("Barra de progresso configurada");
    }
    
    // Inicialmente o player está oculto
    const player = document.querySelector('.player');
    if (player) {
        player.classList.remove('active');
    }
}

// Configurar eventos para o objeto Audio
function setupAudioEvents() {
    console.log("Configurando eventos do áudio...");
    
    // Atualizar barra de progresso
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    // Ao terminar a música, tocar a próxima apenas se não estiver no modo de repetição
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 2) {
            // Repetir a música atual
            audioPlayer.currentTime = 0;
            audioPlayer.play();
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
        updateProgress(); // Atualizar tempo e barra de progresso
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

// Tocar uma música pelo ID
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
    
    // Se já estiver tocando esta música, apenas continuar
    if (currentSong && currentSong.id === song.id) {
        if (!isPlaying) {
            audioPlayer.play();
            isPlaying = true;
            updatePlayerUI();
        }
        return;
    }
    
    console.log(`Reproduzindo: ${song.title} - ${song.artist}`);
    
    // Atualizar a música atual e índice
    currentSong = song;
    currentIndex = currentPlaylist.findIndex(s => s.id === song.id);
    
    // Resetar contador de tentativas
    errorRetries = 0;
    
    // Atualizar o src do player
    audioPlayer.src = song.audioPath;
    
    // Adicionar à lista de reprodução recente
    if (typeof addToRecentlyPlayed === 'function') {
        addToRecentlyPlayed(song.id);
    }
    
    // Tocar a música
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayerUI();
            
            // Se o documento tiver título, atualizá-lo com a música atual
            if (document.title) {
                document.title = `${song.title} - ${song.artist} | Nurva Music`;
            }
        })
        .catch(err => {
            console.error("Erro ao iniciar reprodução:", err);
            
            if (err.name === 'NotAllowedError') {
                alert("A reprodução automática foi bloqueada pelo navegador. Clique no botão play para começar.");
            }
        });
}

// Atualizar a interface do player com as informações da música atual
function updatePlayerUI() {
    if (!currentSong) return;
    
    console.log("Atualizando interface do player");
    
    // Ativar o player (torná-lo visível)
    const player = document.querySelector('.player');
    if (player) {
        player.classList.add('active');
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
        if (repeatMode > 0) {
            repeatBtn.classList.add('active');
            repeatBtn.style.color = '#FFFFFF';
        } else {
            repeatBtn.classList.remove('active');
            repeatBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
    
    // Atualizar a minutagem
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
        if (currentPlaylist.length > 0) {
            playSong(currentPlaylist[0].id);
        }
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    
    updatePlayerUI();
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
    updatePlayerUI();
}

// Ciclar entre os modos de repetição: 0 (não repetir), 1 (repetir playlist), 2 (repetir música)
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    console.log(`Modo de repetição: ${repeatMode}`);
    updatePlayerUI();
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
    if (!currentSong || !audioPlayer.duration) return;
    
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    const progressBar = document.querySelector('.player-progress');
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    // Atualizar o tempo no formato "atual / total"
    const timeDisplay = document.querySelector('.player-time');
    if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
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
    // Implementação futura
    console.log(`Adicionando música ${songId} aos favoritos`);
}

// Adicionar configuração dos botões do player após carregamento
window.addEventListener('load', function() {
    // Configurar botões adicionais
    const shuffleButton = document.querySelector('button:has(.fa-random)');
    const repeatButton = document.querySelector('button:has(.fa-redo)');
    const likeButton = document.querySelector('button:has(.fa-thumbs-up)');
    const dislikeButton = document.querySelector('button:has(.fa-thumbs-down)');
    
    if (shuffleButton) {
        shuffleButton.addEventListener('click', toggleShuffle);
    }
    
    if (repeatButton) {
        repeatButton.addEventListener('click', toggleRepeat);
    }
    
    if (likeButton && currentSong) {
        likeButton.addEventListener('click', () => addToFavorites(currentSong.id));
    }
    
    // Iniciar com volume em 70%
    setVolume(0.7);
}); 