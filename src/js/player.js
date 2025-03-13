// Player de música integrado com o banco de dados local

// Variáveis globais para o player
let currentSong = null;
let isPlaying = false;
let audioPlayer = new Audio();
let currentPlaylist = [];
let currentIndex = 0;
let shuffleMode = false;
let repeatMode = 0; // 0: sem repetição, 1: repetir playlist, 2: repetir música

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
    
    const playButton = document.querySelector('.player-play-button');
    const prevButton = document.querySelector('button:has(.fa-step-backward)');
    const nextButton = document.querySelector('button:has(.fa-step-forward)');
    const volumeControl = document.querySelector('.player-volume-level');
    const progressBar = document.querySelector('.player-progress');
    
    if (playButton) {
        playButton.addEventListener('click', togglePlay);
        console.log("Botão de play configurado");
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', playNextSong);
        console.log("Botão de próxima música configurado");
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', playPrevSong);
        console.log("Botão de música anterior configurado");
    }
    
    if (volumeControl) {
        // Configurar o controle de volume
        document.querySelector('.player-volume-bar').addEventListener('click', function(e) {
            const volumeBar = this.getBoundingClientRect();
            const volumePercent = (e.clientX - volumeBar.left) / volumeBar.width;
            setVolume(volumePercent);
        });
        console.log("Controle de volume configurado");
    }
    
    if (progressBar) {
        // Permitir clique na barra de progresso para avançar/retroceder
        document.querySelector('.player-timeline').addEventListener('click', function(e) {
            if (!currentSong) return;
            
            const timeline = this.getBoundingClientRect();
            const seekPercent = (e.clientX - timeline.left) / timeline.width;
            
            if (audioPlayer.duration) {
                audioPlayer.currentTime = audioPlayer.duration * seekPercent;
            }
        });
        console.log("Barra de progresso configurada");
    }
}

// Configurar eventos para o objeto Audio
function setupAudioEvents() {
    console.log("Configurando eventos do áudio...");
    
    // Atualizar barra de progresso
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    // Ao terminar a música, tocar a próxima
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 2) {
            // Repetir a música atual
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    
    // Atualizar informações do player quando a música é carregada
    audioPlayer.addEventListener('loadedmetadata', function() {
        updateDurationDisplay();
    });
    
    // Lidar com erros
    audioPlayer.addEventListener('error', function(e) {
        console.error("Erro ao reproduzir áudio:", e);
        // Tentar próxima música em caso de erro
        setTimeout(playNextSong, 2000);
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
    
    console.log(`Reproduzindo: ${song.title} - ${song.artist}`);
    
    // Atualizar a música atual e índice
    currentSong = song;
    currentIndex = currentPlaylist.findIndex(s => s.id === song.id);
    
    // Atualizar o src do player
    audioPlayer.src = song.audioPath;
    
    // Tocar a música
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayerUI();
        })
        .catch(err => {
            console.error("Erro ao iniciar reprodução:", err);
            
            // Verificar se é um problema de CORS ou permissões
            if (err.name === 'NotAllowedError') {
                alert("A reprodução automática foi bloqueada pelo navegador. Clique no botão play para começar.");
            } else {
                // Tentar próxima música
                setTimeout(playNextSong, 2000);
            }
        });
}

// Atualizar a interface do player com as informações da música atual
function updatePlayerUI() {
    if (!currentSong) return;
    
    console.log("Atualizando interface do player");
    
    // Atualizar informações da música
    const songInfo = document.querySelector('.player-song-info');
    if (songInfo) {
        const songImg = songInfo.querySelector('img');
        const songName = songInfo.querySelector('.player-song-name');
        const artistName = songInfo.querySelector('.player-artist-name');
        
        if (songImg) songImg.src = currentSong.thumbnail || 'public/assets/thumbnails/default.jpg';
        if (songName) songName.textContent = currentSong.title;
        if (artistName) artistName.textContent = currentSong.artist;
    }
    
    // Atualizar o botão de play/pause
    const playButton = document.querySelector('.player-play-button');
    if (playButton) {
        const icon = playButton.querySelector('i');
        
        if (isPlaying) {
            playButton.classList.add('playing');
            if (icon) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }
        } else {
            playButton.classList.remove('playing');
            if (icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        }
    }
    
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

// Alternar entre play e pause
function togglePlay() {
    console.log("Alternando play/pause");
    
    if (!currentSong) {
        // Se não há música tocando, tocar a primeira do banco
        if (currentPlaylist.length > 0) {
            playSong(currentPlaylist[0].id);
        } else if (musicDatabase && musicDatabase.length > 0) {
            playSong(musicDatabase[0].id);
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
    console.log("Reproduzindo próxima música");
    
    if (!currentPlaylist || currentPlaylist.length === 0) {
        console.warn("Playlist vazia");
        return;
    }
    
    if (shuffleMode) {
        // Modo aleatório
        const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        playSong(currentPlaylist[randomIndex].id);
    } else {
        // Modo sequencial
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        
        if (nextIndex === 0 && repeatMode === 0) {
            // Se estiver no fim da playlist e não estiver no modo repetir, apenas para
            audioPlayer.pause();
            isPlaying = false;
            updatePlayerUI();
        } else {
            playSong(currentPlaylist[nextIndex].id);
        }
    }
}

// Tocar a música anterior
function playPrevSong() {
    console.log("Reproduzindo música anterior");
    
    if (!currentPlaylist || currentPlaylist.length === 0) {
        console.warn("Playlist vazia");
        return;
    }
    
    // Se já passou mais de 3 segundos, reinicia a música atual
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    
    if (shuffleMode) {
        // Modo aleatório
        const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        playSong(currentPlaylist[randomIndex].id);
    } else {
        // Modo sequencial
        let prevIndex = currentIndex - 1;
        
        if (prevIndex < 0) {
            if (repeatMode === 0) {
                // Se estiver no início e não estiver repetindo, apenas reinicia a música
                audioPlayer.currentTime = 0;
            } else {
                // Vai para a última música da playlist
                prevIndex = currentPlaylist.length - 1;
                playSong(currentPlaylist[prevIndex].id);
            }
        } else {
            playSong(currentPlaylist[prevIndex].id);
        }
    }
}

// Definir volume do player
function setVolume(volumeLevel) {
    // Garantir que está entre 0 e 1
    volumeLevel = Math.max(0, Math.min(1, volumeLevel));
    
    audioPlayer.volume = volumeLevel;
    
    // Atualizar barra de volume
    const volumeBar = document.querySelector('.player-volume-level');
    if (volumeBar) {
        volumeBar.style.width = (volumeLevel * 100) + '%';
    }
    
    console.log(`Volume ajustado para ${Math.round(volumeLevel * 100)}%`);
}

// Atualizar a barra de progresso
function updateProgress() {
    const progressBar = document.querySelector('.player-progress');
    const currentTime = document.querySelector('.player-time');
    
    if (!progressBar || !currentTime || !audioPlayer.duration) return;
    
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = percent + '%';
    
    currentTime.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
}

// Atualizar display de duração
function updateDurationDisplay() {
    const timeDisplay = document.querySelector('.player-time');
    
    if (timeDisplay && audioPlayer.duration) {
        timeDisplay.textContent = `0:00 / ${formatTime(audioPlayer.duration)}`;
    }
}

// Alternar modo aleatório
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    console.log(`Modo aleatório: ${shuffleMode ? 'Ativado' : 'Desativado'}`);
    
    // Atualizar visualmente o botão
    const shuffleBtn = document.querySelector('button:has(.fa-random)');
    if (shuffleBtn) {
        if (shuffleMode) {
            shuffleBtn.classList.add('active');
        } else {
            shuffleBtn.classList.remove('active');
        }
    }
}

// Alternar modo de repetição
function toggleRepeat() {
    // Trocar entre os modos: não repetir -> repetir playlist -> repetir música
    repeatMode = (repeatMode + 1) % 3;
    console.log(`Modo de repetição: ${repeatMode}`);
    
    // Atualizar visualmente o botão
    const repeatBtn = document.querySelector('button:has(.fa-redo)');
    if (repeatBtn) {
        repeatBtn.classList.remove('repeat-all', 'repeat-one');
        
        if (repeatMode === 1) {
            repeatBtn.classList.add('repeat-all');
        } else if (repeatMode === 2) {
            repeatBtn.classList.add('repeat-one');
        }
    }
}

// Formatar tempo em MM:SS
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Função auxiliar para buscar música por ID
function getSongById(id) {
    if (!musicDatabase) return null;
    return musicDatabase.find(song => song.id === id);
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