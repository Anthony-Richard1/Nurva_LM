// Gerenciador de playlists otimizado
const PlaylistManager = (function() {
  // Constantes e variáveis
  const STORAGE_KEY = 'nurvaUserPlaylists';
  let userPlaylists = {};
  
  // Inicialização
  function init() {
    loadPlaylists();
    setupEventListeners();
    renderSidebarPlaylists();
    
    // Notificar outros componentes
    document.dispatchEvent(new CustomEvent('nurvaPlaylistsLoaded', { 
      detail: { playlists: userPlaylists }
    }));
  }
  
  // Carregar playlists do localStorage
  function loadPlaylists() {
    try {
      const savedPlaylists = localStorage.getItem(STORAGE_KEY);
      userPlaylists = savedPlaylists ? JSON.parse(savedPlaylists) : {};
      
      // Disponibilizar globalmente
      window.userPlaylists = userPlaylists;
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
      userPlaylists = {};
    }
  }
  
  // Configurar listeners de eventos
  function setupEventListeners() {
    const createPlaylistBtn = document.querySelector('.barra-criar-playlist');
    if (createPlaylistBtn) {
      createPlaylistBtn.addEventListener('click', showCreatePlaylistDialog);
    }
    
    // Evento de carregamento do DOM
    document.addEventListener('DOMContentLoaded', init);
  }
  
  // Salvar playlists no localStorage
  function savePlaylists() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPlaylists));
      
      // Notificar atualizações
      document.dispatchEvent(new CustomEvent('nurvaPlaylistsUpdated', { 
        detail: { playlists: userPlaylists }
      }));
      
      // Atualizar referência global
      window.userPlaylists = userPlaylists;
      return true;
    } catch (error) {
      console.error("Erro ao salvar playlists:", error);
      return false;
    }
  }
  
  // Renderizar playlists na barra lateral
  function renderSidebarPlaylists() {
    const container = document.querySelector('.playlists');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Mensagem se não houver playlists
    if (Object.keys(userPlaylists).length === 0) {
      container.innerHTML = '<div class="sem-playlists">Você ainda não tem playlists. Clique em "+ Criar Nova Playlist" para começar.</div>';
      return;
    }
    
    // Renderizar cada playlist
    Object.entries(userPlaylists).forEach(([name, playlist]) => {
      // Obter capas de músicas
      const coverImages = getCoverImages(playlist.songs, 4);
      
      // Criar elemento
      const element = document.createElement('li');
      element.dataset.playlistName = name;
      element.innerHTML = `
        <div class="playlist-images">
          ${coverImages.map(img => `<img src="${img}" alt="Capa">`).join('')}
        </div>
        <div class="playlist-info">
          <strong>${name}</strong>
          <span>Criada por: ${playlist.createdBy || 'Você'}</span>
        </div>
      `;
      
      // Adicionar eventos
      element.addEventListener('click', () => playPlaylist(name));
      element.addEventListener('contextmenu', e => {
        e.preventDefault();
        showPlaylistOptions(name, e);
      });
      
      container.appendChild(element);
    });
  }
  
  // Obter imagens de capa para uma playlist
  function getCoverImages(songIds, count = 4) {
    const covers = [];
    
    // Adicionar capas das músicas
    if (songIds && songIds.length > 0) {
      songIds.slice(0, count).forEach(id => {
        const song = getSongById(id);
        if (song && song.thumbnail) {
          covers.push(normalizePath(song.thumbnail));
        }
      });
    }
    
    // Preencher com capas padrão se necessário
    while (covers.length < count) {
      covers.push(normalizePath('assets/thumbnails/default.jpg'));
    }
    
    return covers;
  }
  
  // Normalizar caminhos de arquivos
  function normalizePath(path) {
    if (!path) return 'public/assets/thumbnails/default.jpg';
    
    // Manter URLs externas e base64
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    
    // Ajustar caminhos relativos
    if (path.startsWith('../')) {
      path = path.substring(3);
    }
    
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    
    // Ajustar com base na localização atual
    if (path.startsWith('public/') || path.startsWith('assets/')) {
      return isInPagesDirectory && !path.startsWith('../') ? '../' + path : path;
    }
    
    return isInPagesDirectory ? '../public/' + path : 'public/' + path;
  }
  
  // Mostrar diálogo para criar playlist
  function showCreatePlaylistDialog() {
    const dialog = createDialog('create-playlist-dialog', `
      <h3>Criar Nova Playlist</h3>
      <input type="text" id="playlist-name" placeholder="Nome da playlist" maxlength="30">
      <div class="playlist-dialog-buttons">
        <button id="cancel-playlist">Cancelar</button>
        <button id="create-playlist">Criar</button>
      </div>
    `);
    
    // Adicionar estilos se necessário
    ensureDialogStyles();
    
    // Configurar eventos
    dialog.querySelector('#cancel-playlist').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#create-playlist').addEventListener('click', () => {
      const name = dialog.querySelector('#playlist-name').value.trim();
      if (name) {
        createPlaylist(name);
        dialog.remove();
      }
    });
    
    // Focar no input
    setTimeout(() => dialog.querySelector('#playlist-name').focus(), 100);
  }
  
  // Criar uma nova playlist
  function createPlaylist(name) {
    if (userPlaylists[name]) {
      alert(`A playlist "${name}" já existe.`);
      return false;
    }
    
    userPlaylists[name] = {
      songs: [],
      createdBy: "Você",
      createdAt: new Date().toISOString()
    };
    
    savePlaylists();
    renderSidebarPlaylists();
    return true;
  }
  
  // Adicionar música à playlist
  function addSongToPlaylist(songId, playlistName) {
    if (!userPlaylists[playlistName]) return false;
    
    if (userPlaylists[playlistName].songs.includes(songId)) return false;
    
    userPlaylists[playlistName].songs.push(songId);
    savePlaylists();
    renderSidebarPlaylists();
    return true;
  }
  
  // Remover música da playlist
  function removeSongFromPlaylist(songId, playlistName) {
    if (!userPlaylists[playlistName]) return false;
    
    const initialLength = userPlaylists[playlistName].songs.length;
    userPlaylists[playlistName].songs = userPlaylists[playlistName].songs.filter(id => id !== songId);
    
    if (userPlaylists[playlistName].songs.length < initialLength) {
      savePlaylists();
      renderSidebarPlaylists();
      return true;
    }
    
    return false;
  }
  
  // Excluir playlist
  function deletePlaylist(playlistName) {
    if (!userPlaylists[playlistName]) return false;
    
    if (confirm(`Tem certeza que deseja excluir a playlist "${playlistName}"?`)) {
      delete userPlaylists[playlistName];
      savePlaylists();
      renderSidebarPlaylists();
      return true;
    }
    
    return false;
  }
  
  // Reproduzir playlist
  function playPlaylist(playlistName) {
    if (!userPlaylists[playlistName]) return false;
    
    const playlistSongs = userPlaylists[playlistName].songs;
    
    if (playlistSongs.length === 0) {
      alert(`A playlist "${playlistName}" está vazia.`);
      return false;
    }
    
    if (typeof currentPlaylist !== 'undefined') {
      const validSongs = playlistSongs.map(id => getSongById(id)).filter(Boolean);
      
      if (validSongs.length === 0) {
        alert(`Não foi possível encontrar músicas na playlist "${playlistName}".`);
        return false;
      }
      
      currentPlaylist = validSongs;
      currentIndex = 0;
      
      if (currentPlaylist.length > 0) {
        playSong(currentPlaylist[0].id);
        return true;
      }
    }
    
    return false;
  }
  
  // Mostrar opções da playlist
  function showPlaylistOptions(playlistName, event) {
    // Remover menu existente
    document.querySelector('.playlist-options-menu')?.remove();
    
    // Criar menu
    const menu = document.createElement('div');
    menu.className = 'playlist-options-menu';
    menu.innerHTML = `
      <div class="playlist-option play-option">Reproduzir</div>
      <div class="playlist-option add-song-option">Adicionar música</div>
      <div class="playlist-option remove-song-option">Remover música</div>
      <div class="playlist-option delete-option">Excluir playlist</div>
    `;
    
    // Posicionar menu
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    document.body.appendChild(menu);
    
    // Ajustar se fora da tela
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${window.innerHeight - rect.height - 10}px`;
    }
    
    // Configurar eventos
    menu.querySelector('.play-option').addEventListener('click', () => {
      menu.remove();
      playPlaylist(playlistName);
    });
    
    menu.querySelector('.add-song-option').addEventListener('click', () => {
      menu.remove();
      showAddSongDialog(playlistName);
    });
    
    menu.querySelector('.remove-song-option').addEventListener('click', () => {
      menu.remove();
      showRemoveFromPlaylistDialog(playlistName);
    });
    
    menu.querySelector('.delete-option').addEventListener('click', () => {
      menu.remove();
      deletePlaylist(playlistName);
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function handleClick(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', handleClick);
      }
    });
  }
  
  // Mostrar diálogo para remover música
  function showRemoveFromPlaylistDialog(playlistName) {
    if (!userPlaylists[playlistName] || userPlaylists[playlistName].songs.length === 0) {
      alert(`A playlist "${playlistName}" está vazia.`);
      return;
    }
    
    // Criar lista de músicas
    let songListHTML = '';
    userPlaylists[playlistName].songs.forEach(songId => {
      const song = getSongById(songId);
      if (song) {
        songListHTML += `
          <div class="song-item" data-id="${song.id}">
            <img src="${song.thumbnail ? normalizePath(song.thumbnail) : normalizePath('assets/thumbnails/default.jpg')}" alt="${song.title}">
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
    
    // Criar diálogo
    const dialog = createDialog('remove-song-dialog', `
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
    `);
    
    // Adicionar estilos
    ensureSongStyles();
    
    // Configurar eventos
    dialog.querySelector('#close-remove-song').addEventListener('click', () => dialog.remove());
    
    // Configurar pesquisa
    dialog.querySelector('#search-song-input').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      dialog.querySelectorAll('.song-item').forEach(item => {
        const title = item.querySelector('.song-title').textContent.toLowerCase();
        const artist = item.querySelector('.song-artist').textContent.toLowerCase();
        
        item.style.display = (title.includes(searchTerm) || artist.includes(searchTerm)) ? 'flex' : 'none';
      });
    });
    
    // Configurar botões de remoção
    dialog.querySelectorAll('.song-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const songItem = this.closest('.song-item');
        const songId = parseInt(songItem.dataset.id);
        
        songItem.classList.add('removing');
        
        if (confirm(`Tem certeza que deseja remover esta música da playlist "${playlistName}"?`)) {
          if (removeSongFromPlaylist(songId, playlistName)) {
            // Animar remoção
            songItem.style.opacity = '0';
            songItem.style.transform = 'translateX(30px)';
            songItem.style.transition = 'all 0.3s';
            
            setTimeout(() => {
              songItem.remove();
              
              // Verificar se ficou vazia
              if (userPlaylists[playlistName].songs.length === 0) {
                alert(`A playlist "${playlistName}" agora está vazia.`);
                dialog.remove();
              }
            }, 300);
          }
        } else {
          songItem.classList.remove('removing');
        }
      });
    });
  }
  
  // Mostrar diálogo para adicionar música
  function showAddSongDialog(playlistName) {
    if (!musicDatabase || !musicDatabase.length) {
      alert("Banco de dados de música não disponível");
      return;
    }
    
    // Criar lista de músicas
    let songListHTML = '';
    musicDatabase.slice(0, 20).forEach(song => {
      songListHTML += `
        <div class="song-item" data-id="${song.id}">
          <img src="${song.thumbnail ? normalizePath(song.thumbnail) : normalizePath('assets/thumbnails/default.jpg')}" alt="${song.title}">
          <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
          </div>
        </div>
      `;
    });
    
    // Criar diálogo
    const dialog = createDialog('add-song-dialog', `
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
    `);
    
    ensureSongStyles();
    
    // Configurar eventos
    dialog.querySelector('#close-add-song').addEventListener('click', () => dialog.remove());
    
    // Configurar pesquisa
    dialog.querySelector('#search-song-input').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      dialog.querySelectorAll('.song-item').forEach(item => {
        const title = item.querySelector('.song-title').textContent.toLowerCase();
        const artist = item.querySelector('.song-artist').textContent.toLowerCase();
        
        item.style.display = (title.includes(searchTerm) || artist.includes(searchTerm)) ? 'flex' : 'none';
      });
    });
    
    // Configurar seleção de música
    dialog.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', function() {
        const songId = parseInt(this.dataset.id);
        if (addSongToPlaylist(songId, playlistName)) {
          this.style.backgroundColor = '#1DB954';
          setTimeout(() => dialog.remove(), 500);
        }
      });
    });
  }
  
  // Adicionar música atual a uma playlist
  function addCurrentSongToPlaylist() {
    if (!currentSong) {
      alert("Nenhuma música selecionada");
      return;
    }
    
    // Verificar se existem playlists
    if (Object.keys(userPlaylists).length === 0) {
      if (confirm("Você não tem nenhuma playlist. Deseja criar uma nova?")) {
        showCreatePlaylistDialog();
      }
      return;
    }
    
    // Criar lista de playlists
    let playlistListHTML = '';
    Object.keys(userPlaylists).forEach(name => {
      playlistListHTML += `
        <div class="playlist-select-item" data-name="${name}">
          <div class="playlist-select-name">${name}</div>
          <div class="playlist-select-count">${userPlaylists[name].songs.length} músicas</div>
        </div>
      `;
    });
    
    // Criar diálogo
    const dialog = createDialog('select-playlist-dialog', `
      <h3>Adicionar "${currentSong.title}" à playlist</h3>
      <div class="playlists-list">
        ${playlistListHTML}
      </div>
      <div class="playlist-dialog-buttons">
        <button id="cancel-select-playlist">Cancelar</button>
        <button id="create-new-playlist">Nova Playlist</button>
      </div>
    `);
    
    ensurePlaylistSelectStyles();
    
    // Configurar eventos
    dialog.querySelector('#cancel-select-playlist').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#create-new-playlist').addEventListener('click', () => {
      dialog.remove();
      showCreatePlaylistDialog();
    });
    
    // Configurar seleção de playlist
    dialog.querySelectorAll('.playlist-select-item').forEach(item => {
      item.addEventListener('click', function() {
        const playlistName = this.dataset.name;
        if (addSongToPlaylist(currentSong.id, playlistName)) {
          this.style.backgroundColor = '#1DB954';
          setTimeout(() => dialog.remove(), 500);
        }
      });
    });
  }
  
  // Funções utilitárias
  
  // Criar elemento de diálogo padronizado
  function createDialog(id, contentHTML) {
    // Remover diálogo existente se houver
    document.getElementById(id)?.remove();
    
    // Criar novo diálogo
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.className = 'playlist-dialog';
    dialog.innerHTML = `<div class="playlist-dialog-content">${contentHTML}</div>`;
    
    document.body.appendChild(dialog);
    return dialog;
  }
  
  // Garantir que os estilos dos diálogos estão presentes
  function ensureDialogStyles() {
    if (!document.getElementById('playlist-dialog-styles')) {
      const style = document.createElement('style');
      style.id = 'playlist-dialog-styles';
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
        
        .playlist-dialog button#cancel-playlist,
        .playlist-dialog button#close-remove-song,
        .playlist-dialog button#close-add-song,
        .playlist-dialog button#cancel-select-playlist {
          background-color: #444;
          color: white;
        }
        
        .playlist-dialog button#create-playlist,
        .playlist-dialog button#create-new-playlist {
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
    }
  }
  
  // Garantir que os estilos das músicas estão presentes
  function ensureSongStyles() {
    if (!document.getElementById('song-styles')) {
      const style = document.createElement('style');
      style.id = 'song-styles';
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
        
        .songs-list {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 20px;
          background-color: #222;
          border-radius: 4px;
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
    }
  }
  
  // Garantir que os estilos da seleção de playlist estão presentes
  function ensurePlaylistSelectStyles() {
    if (!document.getElementById('playlist-select-styles')) {
      const style = document.createElement('style');
      style.id = 'playlist-select-styles';
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
    }
  }
  
  // Buscar música pelo ID
  function getSongById(id) {
    return typeof musicDatabase !== 'undefined' 
      ? musicDatabase.find(song => song.id === id) 
      : null;
  }
  
  // API pública
  return {
    init,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    playPlaylist,
    addCurrentSongToPlaylist,
    showPlaylistOptions,
    showAddSongDialog,
    showRemoveFromPlaylistDialog
  };
})();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', PlaylistManager.init);

// Exportar para uso global
window.playPlaylist = PlaylistManager.playPlaylist;
window.addCurrentSongToPlaylist = PlaylistManager.addCurrentSongToPlaylist;
window.addSongToPlaylist = PlaylistManager.addSongToPlaylist;
window.removeSongFromPlaylist = PlaylistManager.removeSongFromPlaylist;
window.createUserPlaylist = PlaylistManager.createPlaylist;
window.deletePlaylist = PlaylistManager.deletePlaylist;
window.showPlaylistOptions = PlaylistManager.showPlaylistOptions;
window.showAddSongDialog = PlaylistManager.showAddSongDialog;
window.showRemoveFromPlaylistDialog = PlaylistManager.showRemoveFromPlaylistDialog; 