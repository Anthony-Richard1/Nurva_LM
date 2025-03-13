// Feed da Nurva Music - Versão otimizada

// Tipos de seção
const SECTION_TYPE = {
  MUSIC_ONLY: 'music-only',
  ARTIST_ONLY: 'artist-only',
  MIXED: 'mixed'
};

// Funções auxiliares
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomItems(array, count) {
  return shuffleArray([...array]).slice(0, count);
}

function getUniqueGenres() {
  if (!musicDatabase) return [];
  const genres = new Set();
  musicDatabase.forEach(song => {
    if (song.genre) genres.add(song.genre);
  });
  return Array.from(genres);
}

function getSongsByGenre(genre) {
  if (!musicDatabase) return [];
  return musicDatabase.filter(song => song.genre === genre);
}

function getArtistsByGenre(genre) {
  if (!musicDatabase) return [];
  const artists = new Set();
  musicDatabase.forEach(song => {
    if (song.genre === genre && song.artist) {
      song.artist.split(',').forEach(artist => artists.add(artist.trim()));
    }
  });
  return Array.from(artists);
}

function getSongsByYear(year) {
  if (!musicDatabase) return [];
  return musicDatabase.filter(song => song.year === year);
}

function getRecentYears() {
  if (!musicDatabase) return [];
  const years = new Set();
  musicDatabase.forEach(song => {
    if (song.year) years.add(song.year);
  });
  return Array.from(years).sort((a, b) => b - a);
}

// Configuração dinâmica das seções
function generateFeedSections() {
  const baseSections = [
    {
      id: 'para-voce',
      title: 'Para Você',
      subtitle: 'Recomendações baseadas no seu gosto musical',
      type: SECTION_TYPE.MIXED,
      getContent: () => {
        const totalItems = 15;
        const allContent = [
          ...getTopArtists(totalItems).map(a => ({ type: 'artist', data: a })),
          ...musicDatabase.map(s => ({ type: 'music', data: s }))
        ];
        return getRandomItems(allContent, totalItems);
      }
    },
    {
      id: 'artistas-recomendados',
      title: 'Artistas Recomendados',
      subtitle: 'Artistas que combinam com seu gosto',
      type: SECTION_TYPE.ARTIST_ONLY,
      getContent: () => getRandomItems(getTopArtists(15), 15).map(artist => ({ type: 'artist', data: artist }))
    },
    {
      id: 'mais-ouvidas',
      title: 'Mais Ouvidas',
      subtitle: 'As músicas mais populares do momento',
      type: SECTION_TYPE.MUSIC_ONLY,
      getContent: () => getRandomItems(musicDatabase, 15).map(song => ({ type: 'music', data: song }))
    }
  ];

  // Adicionar seções de gênero
  const genres = getUniqueGenres();
  const genreSections = genres.map(genre => ({
    id: `genre-${genre.toLowerCase().replace(/\s+/g, '-')}`,
    title: genre,
    subtitle: `As melhores de ${genre}`,
    type: SECTION_TYPE.MIXED,
    getContent: () => {
      const genreSongs = getSongsByGenre(genre);
      const genreArtists = getArtistsByGenre(genre).map(name => ({
        name,
        thumbnail: genreSongs.find(s => s.artist.includes(name))?.thumbnail || 'public/assets/images/thumbnails/default.jpg',
        subscribers: `${Math.floor(Math.random() * 35) + 1}M`
      }));
      
      const content = [
        ...genreArtists.map(a => ({ type: 'artist', data: a })),
        ...genreSongs.map(s => ({ type: 'music', data: s }))
      ];
      
      return getRandomItems(content, 15);
    }
  }));

  // Adicionar seções por ano
  const recentYears = getRecentYears().slice(0, 5);
  const yearSections = recentYears.map(year => ({
    id: `year-${year}`,
    title: `Hits de ${year}`,
    subtitle: `As músicas que marcaram ${year}`,
    type: SECTION_TYPE.MUSIC_ONLY,
    getContent: () => {
      const yearSongs = getSongsByYear(year);
      return getRandomItems(yearSongs, 15).map(song => ({ type: 'music', data: song }));
    }
  }));

  // Combinar e embaralhar as seções (mantendo "Para Você" sempre primeiro)
  const firstSection = baseSections.shift();
  const allSections = [
    firstSection,
    ...shuffleArray([
      ...baseSections,
      ...getRandomItems(genreSections, Math.min(6, genreSections.length)),
      ...getRandomItems(yearSections, Math.min(3, yearSections.length))
    ])
  ];

  return allSections;
}

// Funções principais
const isMusicDatabaseAvailable = () => 
  typeof musicDatabase !== 'undefined' && Array.isArray(musicDatabase) && musicDatabase.length > 0;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  if (!isMusicDatabaseAvailable()) {
    setTimeout(() => {
      isMusicDatabaseAvailable() ? initializeFeed() : 
        showErrorMessage('Não foi possível carregar o conteúdo. Tente novamente mais tarde.');
    }, 1000);
    return;
  }
  
  initializeFeed();
});

// Sistema de feed
function initializeFeed() {
  if (!isMusicDatabaseAvailable()) 
    return showErrorMessage('Banco de dados de música não disponível');

  const mainContent = document.querySelector('.content');
  if (!mainContent) return;

  // Limpar conteúdo existente
  const gridCards = mainContent.querySelectorAll('.grid-cards');
  gridCards.forEach(grid => grid.innerHTML = '');

  // Gerar e renderizar seções
  const sections = generateFeedSections();
  sections.forEach((section, index) => {
    const sectionElement = createSectionElement(section);
    const content = section.getContent();
    
    if (content && content.length > 0) {
      const gridCards = sectionElement.querySelector('.grid-cards');
      renderItems(content, gridCards);
      mainContent.appendChild(sectionElement);
    }
  });

  initializeCarousels();
}

// Criar elemento de seção
function createSectionElement(section) {
  const sectionElement = document.createElement('div');
  sectionElement.className = section.id === 'para-voce' ? 'secao-destacada' : 'secao';
  sectionElement.setAttribute('data-section', section.id);
  
  sectionElement.innerHTML = `
    <div class="secao-header">
      <div>
        <h2 class="secao-titulo">${section.title}</h2>
        <p class="secao-subtitulo">${section.subtitle}</p>
      </div>
      <button class="mais-btn">
        <span>Mais</span>
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div class="grid-cards"></div>
  `;

  return sectionElement;
}

// Exibir mensagem de erro
function showErrorMessage(message, sectionElement) {
  const errorElement = document.createElement('p');
  errorElement.className = 'erro-feed';
  errorElement.textContent = message;
  errorElement.style.cssText = 'text-align:center; padding:20px; color:rgba(255,255,255,0.7)';
  
  if (sectionElement) {
    sectionElement.appendChild(errorElement);
  } else {
    document.querySelectorAll('.secao .grid-cards, .secao-destacada .grid-cards')
      .forEach(section => section.appendChild(errorElement.cloneNode(true)));
  }
}

// Carregar conteúdo para todas as seções
function loadAllSections() {
  [...FEED_SECTIONS]
    .sort((a, b) => a.position - b.position)
    .forEach(section => {
      const sectionElement = findSectionElement(section);
      if (!sectionElement) {
        console.warn(`Seção não encontrada: ${section.title}`);
        return;
      }
      
      sectionElement.innerHTML = '';
      
      // Carregar conteúdo com base no tipo
      const loaders = {
        [SECTION_TYPE.MUSIC_ONLY]: loadMusicSection,
        [SECTION_TYPE.ARTIST_ONLY]: loadArtistSection,
        [SECTION_TYPE.MIXED]: loadMixedSection
      };
      
      loaders[section.type](section, sectionElement);
    });
}

// Estratégias otimizadas para encontrar elementos de seção
function findSectionElement(section) {
  // Método auxiliar contains
  if (!HTMLElement.prototype.contains) {
    HTMLElement.prototype.contains = function(text) {
      return this.textContent.includes(text);
    };
  }
  
  // Estratégia 1: Pela seção inteira usando título
  const sectionByTitle = findSectionByTitle(section.title);
  if (sectionByTitle) {
    const gridCards = sectionByTitle.querySelector('.grid-cards');
    if (gridCards) return gridCards;
  }
  
  // Estratégia 2: Usando seletores configurados
  try {
    const selectors = [
      section.cssSelector,
      `#${section.id} .grid-cards`,
      `[data-section="${section.id}"] .grid-cards`,
      `.secao:nth-of-type(${section.position}) .grid-cards`,
      `div:nth-of-type(${section.position}) .grid-cards`
    ];
    
    // Para Você: tentar seletor específico
    if (section.id === 'para-voce' || section.title === 'Para Você') {
      selectors.push('.secao-destacada .grid-cards');
    }
    
    // Tentar cada seletor
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          section.cssSelector = selector;
          return element;
        }
      } catch (e) {} // Ignorar erros de seletor
    }
    
    // Estratégia por texto do título
    const titleElements = document.querySelectorAll('.secao-titulo');
    for (const titleEl of titleElements) {
      if (titleEl.textContent.trim() === section.title) {
        const parent = titleEl.closest('.secao, .secao-destacada');
        if (parent) {
          const gridCards = parent.querySelector('.grid-cards');
          if (gridCards) {
            parent.setAttribute('data-section', section.id);
            section.cssSelector = `[data-section="${section.id}"] .grid-cards`;
            return gridCards;
          }
        }
      }
    }
    
    // Última tentativa: verificar grid-cards não utilizados
    const usedSelectors = FEED_SECTIONS.map(s => s.cssSelector);
    const allGridCards = document.querySelectorAll('.grid-cards');
    
    for (const grid of allGridCards) {
      if (!usedSelectors.some(selector => {
        try { return document.querySelector(selector) === grid; } 
        catch(e) { return false; }
      })) {
        const parent = grid.closest('.secao, .secao-destacada');
        if (parent) {
          parent.setAttribute('data-section', section.id);
          section.cssSelector = `[data-section="${section.id}"] .grid-cards`;
        }
        return grid;
      }
    }
  } catch (e) {} // Ignorar erros
  
  return null; // Nenhum elemento encontrado
}

// Funções de carregamento de conteúdo
function loadMusicSection(section, sectionElement) {
  if (!isMusicDatabaseAvailable()) return;
  
  // Obter e filtrar músicas
  const maxIndex = Math.min(section.musicRange[1], musicDatabase.length);
  const minIndex = Math.min(section.musicRange[0], maxIndex);
  let songs = musicDatabase.slice(minIndex, maxIndex);
  
  if (section.filter) songs = songs.filter(section.filter);
  
  // Verificar se temos músicas
  if (!songs.length) {
    if (section.filter) songs = musicDatabase.slice(minIndex, maxIndex);
    if (!songs.length) return showErrorMessage('Nenhuma música encontrada', sectionElement);
  }
  
  // Renderizar músicas
  renderItems(songs.map(song => ({ type: 'music', data: song })), sectionElement);
}

function loadArtistSection(section, sectionElement) {
  if (!isMusicDatabaseAvailable()) return;
  
  // Obter artistas
  const artists = getTopArtists(section.artistCount);
  if (!artists.length) return showErrorMessage('Nenhum artista encontrado', sectionElement);
  
  // Renderizar artistas
  renderItems(artists.map(artist => ({ type: 'artist', data: artist })), sectionElement);
}

function loadMixedSection(section, sectionElement) {
  if (!isMusicDatabaseAvailable()) return;
  
  // Obter músicas e artistas
  const maxIndex = Math.min(section.musicRange[1], musicDatabase.length);
  const minIndex = Math.min(section.musicRange[0], maxIndex);
  let songs = section.filter ? 
    musicDatabase.slice(minIndex, maxIndex).filter(section.filter) : 
    musicDatabase.slice(minIndex, maxIndex);
  
  const artists = getTopArtists(section.artistCount);
  
  // Verificar se temos conteúdo
  if (!songs.length && !artists.length) {
    return showErrorMessage('Nenhum conteúdo disponível', sectionElement);
  }
  
  // Preparar itens: artistas primeiro, depois músicas
  const items = [
    ...artists.map(artist => ({ type: 'artist', data: artist })),
    ...songs.map(song => ({ type: 'music', data: song }))
  ];
  
  renderItems(items, sectionElement);
}

// Renderizar itens
function renderItems(items, container) {
  const fragment = document.createDocumentFragment();
  
  items.forEach((item, index) => {
    const card = item.type === 'music' ? 
      createMusicCard(item.data, index) : 
      createArtistCard(item.data);
      
    if (card) fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

// Obter principais artistas
function getTopArtists(count) {
  if (!isMusicDatabaseAvailable()) return [];
  
  // Agrupar músicas por artista
  const artistStats = {};
  
  musicDatabase.forEach(song => {
    if (!song.artist) return;
    
    song.artist.split(',').map(a => a.trim()).forEach(artist => {
      if (!artist || artist === 'Álbum Desconhecido' || artist === 'Unknown') return;
      
      if (!artistStats[artist]) {
        artistStats[artist] = { name: artist, songCount: 1, songs: [song] };
      } else {
        artistStats[artist].songCount++;
        if (!artistStats[artist].songs.some(s => s.id === song.id)) {
          artistStats[artist].songs.push(song);
        }
      }
    });
  });
  
  // Preparar array de artistas
  const artists = Object.values(artistStats)
    .filter(artist => artist.songs.length > 0)
    .map(artist => {
      // Selecionar melhor thumbnail
      const songWithThumbnail = artist.songs.find(song => 
        song.thumbnail && song.thumbnail !== 'public/assets/images/thumbnails/default.jpg');
      
      return {
        name: artist.name,
        songCount: artist.songCount,
        thumbnail: songWithThumbnail ? songWithThumbnail.thumbnail : 
                  (artist.songs[0]?.thumbnail || 'public/assets/images/thumbnails/default.jpg'),
        subscribers: `${Math.floor(Math.random() * 35) + 1}M`
      };
    })
    .sort((a, b) => b.songCount - a.songCount)
    .slice(0, count);

  // Encontrar artistas com boa qualidade de thumbnails
  const artistsWithGoodThumbnails = artists.filter(artist => 
    artist && artist.thumbnail && 
    artist.thumbnail !== 'public/assets/images/thumbnails/default.jpg');

  return artistsWithGoodThumbnails.length > 0 ? artistsWithGoodThumbnails : artists;
}

// Criar cards
function createArtistCard(artist) {
  if (!artist?.name) return null;
  
  const card = document.createElement('div');
  card.className = 'artista grid-cards-item';
  card.setAttribute('data-id', artist.id || '');
  
  card.innerHTML = `
    <div class="ellipse-1"></div>
    <div class="circulo">
      <img src="${artist.thumbnail || 'public/assets/images/thumbnails/default.jpg'}" alt="${artist.name}" class="foto-artista">
    </div>
    <h3 class="nome-do-artista">${artist.name}</h3>
    <div class="inscritos">
      <div class="inscritos2">${artist.subscribers} inscritos</div>
    </div>
  `;
  
  return card;
}

function createMusicCard(song, index) {
  if (!song?.title) return null;
  
  const card = document.createElement('div');
  card.className = 'musica grid-cards-item';
  card.setAttribute('data-id', song.id);
  card.setAttribute('data-index', index);
  
  card.innerHTML = `
    <div class="blur"></div>
    <div class="image-container">
      <img src="${song.thumbnail || 'public/assets/images/thumbnails/default.jpg'}" alt="${song.title}" class="foto">
    </div>
    <div class="textos">
      <h3 class="titulo-da-musica">${song.title}</h3>
      <div class="detalhes">
        <span class="tipo-item">Música</span>
        <span class="artista-nome">${song.artist || 'Artista Desconhecido'}</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    if (typeof playSong === 'function') playSong(song.id);
  });
  
  return card;
}

// Sistema de carrosséis
function initializeCarousels() {
  document.querySelectorAll('.secao, .secao-destacada').forEach(section => {
    const carousel = section.querySelector('.grid-cards');
    if (!carousel || carousel.children.length === 0 || section.querySelector('.navigation-indicator')) return;
    
    // Criar e adicionar botões de navegação
    const navButtons = {
      prev: document.createElement('div'),
      next: document.createElement('div')
    };
    
    navButtons.prev.className = 'navigation-indicator nav-prev';
    navButtons.next.className = 'navigation-indicator nav-next';
    navButtons.prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    navButtons.next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    section.appendChild(navButtons.prev);
    section.appendChild(navButtons.next);
    
    // Visibilidade inicial
    const needsScroll = carousel.scrollWidth > carousel.offsetWidth;
    navButtons.prev.style.opacity = '0';
    navButtons.next.style.opacity = needsScroll ? '0.3' : '0';
    
    // Configurar navegação
    navButtons.next.addEventListener('click', () => 
      carousel.scrollBy({ left: carousel.offsetWidth * 0.8, behavior: 'smooth' }));
    
    navButtons.prev.addEventListener('click', () => 
      carousel.scrollBy({ left: -carousel.offsetWidth * 0.8, behavior: 'smooth' }));
    
    // Eventos de visibilidade
    const updateNavVisibility = () => {
      if (carousel.scrollWidth <= carousel.offsetWidth) {
        navButtons.prev.style.opacity = navButtons.next.style.opacity = '0';
        return;
      }
      
      navButtons.prev.style.opacity = carousel.scrollLeft > 10 ? '1' : '0.3';
      navButtons.next.style.opacity = 
        carousel.scrollLeft < carousel.scrollWidth - carousel.offsetWidth - 10 ? '1' : '0.3';
    };
    
    section.addEventListener('mouseenter', updateNavVisibility);
    section.addEventListener('mouseleave', () => {
      navButtons.prev.style.opacity = navButtons.next.style.opacity = '0';
    });
    
    carousel.addEventListener('scroll', updateNavVisibility);
  });
} 