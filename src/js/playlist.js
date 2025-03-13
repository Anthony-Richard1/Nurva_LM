// Funcionalidades para gerenciar playlists
let userPlaylists = {};

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando gerenciador de playlists...");
    
    // Carregar playlists do localStorage
    loadUserPlaylists();
    
    // Configurar evento para o botão de criar playlist
    const createPlaylistBtn = document.querySelector('.barra-criar-playlist');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', showCreatePlaylistDialog);
        console.log("Botão de criar playlist configurado");
    }
    
    // Renderizar playlists existentes
    renderUserPlaylists();
});

// Carregar playlists do localStorage
function loadUserPlaylists() {
    try {
        const savedPlaylists = localStorage.getItem('nurva_user_playlists');
        if (savedPlaylists) {
            userPlaylists = JSON.parse(savedPlaylists);
            console.log(`Playlists carregadas: ${Object.keys(userPlaylists).length}`);
        } else {
            // Criar algumas playlists de exemplo se nenhuma existir
            if (Object.keys(userPlaylists).length === 0) {
                createExamplePlaylists();
            }
        }
    } catch (error) {
        console.error("Erro ao carregar playlists:", error);
        userPlaylists = {};
    }
}

// Criar playlists de exemplo
function createExamplePlaylists() {
    if (typeof musicDatabase === 'undefined' || !musicDatabase.length) {
        console.warn("Banco de dados de música não disponível para criar playlists de exemplo");
        return;
    }
    
    // Exemplo 1: Músicas mais recentes
    userPlaylists["Minhas Favoritas"] = {
        name: "Minhas Favoritas",
        songs: musicDatabase.slice(0, 5).map(song => song.id),
        coverImage: "public/assets/thumbnails/default.jpg",
        createdBy: "Você",
        createdAt: new Date().toISOString()
    };
    
    // Exemplo 2: Músicas aleatórias
    const randomSongs = [...musicDatabase]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map(song => song.id);
    
    userPlaylists["Para relaxar"] = {
        name: "Para relaxar",
        songs: randomSongs,
        coverImage: "public/assets/thumbnails/default.jpg",
        createdBy: "Você",
        createdAt: new Date().toISOString()
    };
    
    // Salvar as playlists criadas
    saveUserPlaylists();
}

// Salvar playlists no localStorage
function saveUserPlaylists() {
    try {
        localStorage.setItem('nurva_user_playlists', JSON.stringify(userPlaylists));
        console.log("Playlists salvas com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao salvar playlists:", error);
        return false;
    }
}

// Renderizar as playlists na interface
function renderUserPlaylists() {
    const playlistsContainer = document.querySelector('.playlists');
    if (!playlistsContainer) return;
    
    // Limpar o container
    playlistsContainer.innerHTML = '';
    
    // Se não houver playlists, mostrar mensagem
    if (Object.keys(userPlaylists).length === 0) {
        playlistsContainer.innerHTML = '<div class="sem-playlists">Você ainda não tem playlists. Clique em "+ Criar Nova Playlist" para começar.</div>';
        return;
    }
    
    // Renderizar cada playlist
    Object.values(userPlaylists).forEach(playlist => {
        // Obter até 4 capas de músicas para a playlist
        let coverImages = [];
        playlist.songs.slice(0, 4).forEach(songId => {
            const song = getSongById(songId);
            if (song && song.thumbnail) {
                coverImages.push(song.thumbnail);
            }
        });
        
        // Se não houver capas suficientes, usar a capa padrão
        while (coverImages.length < 4) {
            coverImages.push('public/assets/thumbnails/default.jpg');
        }
        
        // Criar elemento para a playlist
        const playlistElement = document.createElement('li');
        playlistElement.dataset.playlistName = playlist.name;
        playlistElement.innerHTML = `
            <div class="playlist-images">
                <img src="${coverImages[0]}" alt="Capa 1">
                <img src="${coverImages[1]}" alt="Capa 2">
                <img src="${coverImages[2]}" alt="Capa 3">
                <img src="${coverImages[3]}" alt="Capa 4">
            </div>
            <div class="playlist-info">
                <strong>${playlist.name}</strong>
                <span>Criado por: ${playlist.createdBy}</span>
            </div>
        `;
        
        // Adicionar evento de clique para tocar a playlist
        playlistElement.addEventListener('click', function() {
            playPlaylist(playlist.name);
        });
        
        // Adicionar evento de contexto para mostrar opções da playlist
        playlistElement.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showPlaylistOptions(playlist.name, e);
        });
        
        // Adicionar ao container
        playlistsContainer.appendChild(playlistElement);
    });
}

// Mostrar diálogo para criar uma nova playlist
function showCreatePlaylistDialog() {
    // Verificar se o elemento já existe
    let dialog = document.getElementById('create-playlist-dialog');
    
    // Se não existir, criar
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = 'create-playlist-dialog';
        dialog.className = 'playlist-dialog';
        dialog.innerHTML = `
            <div class="playlist-dialog-content">
                <h3>Criar Nova Playlist</h3>
                <input type="text" id="playlist-name" placeholder="Nome da playlist" maxlength="30">
                <div class="playlist-dialog-buttons">
                    <button id="cancel-playlist">Cancelar</button>
                    <button id="create-playlist">Criar</button>
                </div>
            </div>
        `;
        
        // Adicionar estilos
        const style = document.createElement('style');
        style.textContent = `
            .playlist-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .playlist-dialog-content {
                background-color: #1e1e1e;
                padding: 20px;
                border-radius: 10px;
                width: 350px;
                max-width: 90%;
            }
            
            .playlist-dialog h3 {
                margin-top: 0;
                color: white;
                margin-bottom: 15px;
            }
            
            .playlist-dialog input {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                background-color: #333;
                border: 1px solid #444;
                color: white;
                border-radius: 4px;
            }
            
            .playlist-dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .playlist-dialog button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .playlist-dialog button#cancel-playlist {
                background-color: #444;
                color: white;
            }
            
            .playlist-dialog button#create-playlist {
                background-color: #1DB954;
                color: white;
            }
            
            .playlist-options-menu {
                position: absolute;
                background-color: #282828;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                padding: 5px 0;
            }
            
            .playlist-option {
                padding: 8px 15px;
                color: white;
                cursor: pointer;
            }
            
            .playlist-option:hover {
                background-color: #333;
            }
            
            .sem-playlists {
                color: rgba(255, 255, 255, 0.7);
                text-align: center;
                padding: 10px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Configurar eventos
        document.getElementById('cancel-playlist').addEventListener('click', function() {
            dialog.remove();
        });
        
        document.getElementById('create-playlist').addEventListener('click', function() {
            const playlistName = document.getElementById('playlist-name').value.trim();
            if (playlistName) {
                createUserPlaylist(playlistName);
                dialog.remove();
            }
        });
        
        // Focar o input
        setTimeout(() => {
            document.getElementById('playlist-name').focus();
        }, 100);
    } else {
        // Se já existir, apenas mostrar
        document.body.appendChild(dialog);
    }
}

// Criar uma nova playlist
function createUserPlaylist(name) {
    if (userPlaylists[name]) {
        alert(`A playlist "${name}" já existe.`);
        return false;
    }
    
    userPlaylists[name] = {
        name: name,
        songs: [],
        coverImage: "public/assets/thumbnails/default.jpg",
        createdBy: "Você",
        createdAt: new Date().toISOString()
    };
    
    saveUserPlaylists();
    renderUserPlaylists();
    
    console.log(`Playlist "${name}" criada com sucesso`);
    return true;
}

// Adicionar uma música à playlist
function addSongToPlaylist(songId, playlistName) {
    if (!userPlaylists[playlistName]) {
        console.error(`Playlist "${playlistName}" não encontrada`);
        return false;
    }
    
    if (userPlaylists[playlistName].songs.includes(songId)) {
        console.log(`Música ${songId} já existe na playlist ${playlistName}`);
        return false;
    }
    
    userPlaylists[playlistName].songs.push(songId);
    saveUserPlaylists();
    renderUserPlaylists();
    
    console.log(`Música ${songId} adicionada à playlist ${playlistName}`);
    return true;
}

// Remover uma música da playlist
function removeSongFromPlaylist(songId, playlistName) {
    if (!userPlaylists[playlistName]) {
        console.error(`Playlist "${playlistName}" não encontrada`);
        return false;
    }
    
    const initialLength = userPlaylists[playlistName].songs.length;
    userPlaylists[playlistName].songs = userPlaylists[playlistName].songs.filter(id => id !== songId);
    
    if (userPlaylists[playlistName].songs.length < initialLength) {
        saveUserPlaylists();
        renderUserPlaylists();
        
        console.log(`Música ${songId} removida da playlist ${playlistName}`);
        return true;
    }
    
    return false;
}

// Excluir uma playlist
function deletePlaylist(playlistName) {
    if (!userPlaylists[playlistName]) {
        console.error(`Playlist "${playlistName}" não encontrada`);
        return false;
    }
    
    if (confirm(`Tem certeza que deseja excluir a playlist "${playlistName}"?`)) {
        delete userPlaylists[playlistName];
        saveUserPlaylists();
        renderUserPlaylists();
        
        console.log(`Playlist "${playlistName}" excluída com sucesso`);
        return true;
    }
    
    return false;
}

// Reproduzir uma playlist
function playPlaylist(playlistName) {
    if (!userPlaylists[playlistName]) {
        console.error(`Playlist "${playlistName}" não encontrada`);
        return false;
    }
    
    const playlistSongs = userPlaylists[playlistName].songs;
    
    if (playlistSongs.length === 0) {
        alert(`A playlist "${playlistName}" está vazia.`);
        return false;
    }
    
    // Preparar a lista de reprodução
    if (typeof currentPlaylist !== 'undefined') {
        // Criar uma nova lista apenas com as músicas da playlist
        currentPlaylist = playlistSongs.map(id => getSongById(id)).filter(Boolean);
        currentIndex = 0;
        
        // Iniciar a reprodução da primeira música
        if (currentPlaylist.length > 0) {
            playSong(currentPlaylist[0].id);
            return true;
        }
    } else {
        console.error("Variável currentPlaylist não disponível");
    }
    
    return false;
}

// Mostrar menu de opções da playlist
function showPlaylistOptions(playlistName, event) {
    // Remover qualquer menu existente
    const existingMenu = document.querySelector('.playlist-options-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Criar menu de opções
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'playlist-options-menu';
    optionsMenu.innerHTML = `
        <div class="playlist-option play-option">Reproduzir</div>
        <div class="playlist-option add-song-option">Adicionar música</div>
        <div class="playlist-option remove-song-option">Remover música</div>
        <div class="playlist-option delete-option">Excluir playlist</div>
    `;
    
    // Posicionar menu
    optionsMenu.style.left = `${event.clientX}px`;
    optionsMenu.style.top = `${event.clientY}px`;
    document.body.appendChild(optionsMenu);
    
    // Ajustar posição se estiver fora da tela
    const rect = optionsMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        optionsMenu.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    if (rect.bottom > window.innerHeight) {
        optionsMenu.style.top = `${window.innerHeight - rect.height - 10}px`;
    }
    
    // Configurar eventos
    optionsMenu.querySelector('.play-option').addEventListener('click', function() {
        optionsMenu.remove();
        playPlaylist(playlistName);
    });
    
    optionsMenu.querySelector('.add-song-option').addEventListener('click', function() {
        optionsMenu.remove();
        showAddSongDialog(playlistName);
    });
    
    optionsMenu.querySelector('.remove-song-option').addEventListener('click', function() {
        optionsMenu.remove();
        showRemoveFromPlaylistDialog(playlistName);
    });
    
    optionsMenu.querySelector('.delete-option').addEventListener('click', function() {
        optionsMenu.remove();
        deletePlaylist(playlistName);
    });
    
    // Remover ao clicar fora
    document.addEventListener('click', function removeMenu(e) {
        if (!optionsMenu.contains(e.target)) {
            optionsMenu.remove();
            document.removeEventListener('click', removeMenu);
        }
    });
}

// Função para mostrar diálogo de remover música da playlist
function showRemoveFromPlaylistDialog(playlistName) {
    if (!userPlaylists[playlistName] || userPlaylists[playlistName].songs.length === 0) {
        alert(`A playlist "${playlistName}" está vazia.`);
        return;
    }
    
    // Verificar se o elemento já existe
    let dialog = document.getElementById('remove-song-dialog');
    
    // Se não existir, criar
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = 'remove-song-dialog';
        dialog.className = 'playlist-dialog';
        
        // Criar lista de músicas da playlist
        let songListHTML = '';
        const playlistSongs = userPlaylists[playlistName].songs;
        
        // Para cada ID de música na playlist, buscar os detalhes
        playlistSongs.forEach(songId => {
            const song = getSongById(songId);
            if (song) {
                songListHTML += `
                    <div class="song-item" data-id="${song.id}">
                        <img src="${song.thumbnail || 'public/assets/thumbnails/default.jpg'}" alt="${song.title}">
                        <div class="song-info">
                            <div class="song-title">${song.title}</div>
                            <div class="song-artist">${song.artist}</div>
                        </div>
                        <div class="song-remove">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                `;
            }
        });
        
        dialog.innerHTML = `
            <div class="playlist-dialog-content">
                <h3>Remover Músicas de "${playlistName}"</h3>
                <div class="search-songs">
                    <input type="text" id="search-song-input" placeholder="Pesquisar nas músicas da playlist...">
                </div>
                <div class="songs-list">
                    ${songListHTML}
                </div>
                <div class="playlist-dialog-buttons">
                    <button id="close-remove-song">Fechar</button>
                </div>
            </div>
        `;
        
        // Adicionar estilos específicos para o botão de remover
        const style = document.createElement('style');
        style.textContent = `
            .song-remove {
                color: #e74c3c;
                cursor: pointer;
                margin-left: 8px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .song-remove:hover {
                opacity: 1;
            }
            
            .song-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                cursor: default;
                border-bottom: 1px solid #333;
            }
            
            .song-item.removing {
                background-color: rgba(231, 76, 60, 0.2);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Configurar eventos
        document.getElementById('close-remove-song').addEventListener('click', function() {
            dialog.remove();
        });
        
        // Pesquisar músicas
        document.getElementById('search-song-input').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const songItems = document.querySelectorAll('#remove-song-dialog .song-item');
            
            songItems.forEach(item => {
                const title = item.querySelector('.song-title').textContent.toLowerCase();
                const artist = item.querySelector('.song-artist').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Remover música ao clicar no ícone de lixeira
        document.querySelectorAll('#remove-song-dialog .song-remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', function() {
                const songItem = this.closest('.song-item');
                const songId = parseInt(songItem.dataset.id);
                
                // Adicionar efeito visual
                songItem.classList.add('removing');
                
                // Confirmar antes de remover
                if (confirm(`Tem certeza que deseja remover esta música da playlist "${playlistName}"?`)) {
                    if (removeSongFromPlaylist(songId, playlistName)) {
                        // Remover o item da lista visualmente com animação
                        setTimeout(() => {
                            songItem.style.opacity = '0';
                            songItem.style.transform = 'translateX(30px)';
                            songItem.style.transition = 'all 0.3s';
                            
                            setTimeout(() => {
                                songItem.remove();
                                
                                // Se não houver mais músicas, fechar o diálogo
                                if (userPlaylists[playlistName].songs.length === 0) {
                                    alert(`A playlist "${playlistName}" agora está vazia.`);
                                    dialog.remove();
                                }
                            }, 300);
                        }, 100);
                    }
                } else {
                    // Remover o efeito visual se cancelado
                    songItem.classList.remove('removing');
                }
            });
        });
    } else {
        // Se já existir, apenas mostrar
        document.body.appendChild(dialog);
    }
}

// Mostrar diálogo para adicionar música
function showAddSongDialog(playlistName) {
    if (!musicDatabase || !musicDatabase.length) {
        alert("Banco de dados de música não disponível");
        return;
    }
    
    // Verificar se o elemento já existe
    let dialog = document.getElementById('add-song-dialog');
    
    // Se não existir, criar
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = 'add-song-dialog';
        dialog.className = 'playlist-dialog';
        
        // Criar lista de músicas
        let songListHTML = '';
        musicDatabase.slice(0, 20).forEach(song => {
            songListHTML += `
                <div class="song-item" data-id="${song.id}">
                    <img src="${song.thumbnail || 'public/assets/thumbnails/default.jpg'}" alt="${song.title}">
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                </div>
            `;
        });
        
        dialog.innerHTML = `
            <div class="playlist-dialog-content">
                <h3>Adicionar Música à "${playlistName}"</h3>
                <div class="search-songs">
                    <input type="text" id="search-song-input" placeholder="Pesquisar músicas...">
                </div>
                <div class="songs-list">
                    ${songListHTML}
                </div>
                <div class="playlist-dialog-buttons">
                    <button id="close-add-song">Fechar</button>
                </div>
            </div>
        `;
        
        // Adicionar estilos específicos
        const style = document.createElement('style');
        style.textContent = `
            .songs-list {
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
                background-color: #222;
                border-radius: 4px;
            }
            
            .song-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                cursor: pointer;
                border-bottom: 1px solid #333;
            }
            
            .song-item:hover {
                background-color: #333;
            }
            
            .song-item img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
            }
            
            .song-info {
                flex: 1;
            }
            
            .song-title {
                color: white;
                font-size: 14px;
            }
            
            .song-artist {
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
            }
            
            .search-songs input {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                background-color: #333;
                border: 1px solid #444;
                color: white;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Configurar eventos
        document.getElementById('close-add-song').addEventListener('click', function() {
            dialog.remove();
        });
        
        // Pesquisar músicas
        document.getElementById('search-song-input').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const songItems = document.querySelectorAll('.song-item');
            
            songItems.forEach(item => {
                const title = item.querySelector('.song-title').textContent.toLowerCase();
                const artist = item.querySelector('.song-artist').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Adicionar música ao clicar
        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', function() {
                const songId = parseInt(this.dataset.id);
                if (addSongToPlaylist(songId, playlistName)) {
                    this.style.backgroundColor = '#1DB954';
                    setTimeout(() => {
                        dialog.remove();
                    }, 500);
                }
            });
        });
    } else {
        // Se já existir, apenas mostrar
        document.body.appendChild(dialog);
    }
}

// Adicionar função para adicionar a música atual a uma playlist
function addCurrentSongToPlaylist() {
    if (!currentSong) {
        alert("Nenhuma música selecionada");
        return;
    }
    
    // Se não houver playlists, criar uma
    if (Object.keys(userPlaylists).length === 0) {
        if (confirm("Você não tem nenhuma playlist. Deseja criar uma nova?")) {
            showCreatePlaylistDialog();
        }
        return;
    }
    
    // Mostrar diálogo para selecionar a playlist
    let dialog = document.createElement('div');
    dialog.className = 'playlist-dialog';
    
    // Criar lista de playlists
    let playlistListHTML = '';
    Object.keys(userPlaylists).forEach(playlistName => {
        playlistListHTML += `
            <div class="playlist-select-item" data-name="${playlistName}">
                <div class="playlist-select-name">${playlistName}</div>
                <div class="playlist-select-count">${userPlaylists[playlistName].songs.length} músicas</div>
            </div>
        `;
    });
    
    dialog.innerHTML = `
        <div class="playlist-dialog-content">
            <h3>Adicionar "${currentSong.title}" à playlist</h3>
            <div class="playlists-list">
                ${playlistListHTML}
            </div>
            <div class="playlist-dialog-buttons">
                <button id="cancel-select-playlist">Cancelar</button>
                <button id="create-new-playlist">Nova Playlist</button>
            </div>
        </div>
    `;
    
    // Adicionar estilos específicos
    const style = document.createElement('style');
    style.textContent = `
        .playlists-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 20px;
            background-color: #222;
            border-radius: 4px;
        }
        
        .playlist-select-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: 1px solid #333;
        }
        
        .playlist-select-item:hover {
            background-color: #333;
        }
        
        .playlist-select-name {
            color: white;
            font-size: 14px;
            font-weight: 500;
        }
        
        .playlist-select-count {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(dialog);
    
    // Configurar eventos
    document.getElementById('cancel-select-playlist').addEventListener('click', function() {
        dialog.remove();
    });
    
    document.getElementById('create-new-playlist').addEventListener('click', function() {
        dialog.remove();
        showCreatePlaylistDialog();
    });
    
    // Adicionar música ao clicar na playlist
    document.querySelectorAll('.playlist-select-item').forEach(item => {
        item.addEventListener('click', function() {
            const playlistName = this.dataset.name;
            if (addSongToPlaylist(currentSong.id, playlistName)) {
                this.style.backgroundColor = '#1DB954';
                setTimeout(() => {
                    dialog.remove();
                }, 500);
            }
        });
    });
}

// Exportar funções para uso global
window.playPlaylist = playPlaylist;
window.addCurrentSongToPlaylist = addCurrentSongToPlaylist;
window.userPlaylists = userPlaylists; 