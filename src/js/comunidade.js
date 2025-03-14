// Dados das comunidades
const comunidades = [
    {
        id: 1,
        nome: "Don Toliver",
        descricao: "Comunidade Destinada ao Artista Don Toliver",
        imagem: "Don Toliver - No Idea.jpg",
        genero: "Hip-Hop"
    },
    {
        id: 2,
        nome: "Rock",
        descricao: "Comunidade Para Loucos por Rock",
        imagem: "../public/assets/images/playlist_capa_beatles.jpg",
        genero: "Rock"
    },
    {
        id: 3,
        nome: "The Weeknd",
        descricao: "Comunidade paras os X.O de plantão",
        imagem: "The Weeknd, Daft Punk - Starboy.jpg",
        genero: "Pop"
    },
    {
        id: 4,
        nome: "Metro Boomin",
        descricao: "Metroooooooooooooooooooooooooooooooooooooooo",
        imagem: "Metro Boomin, Gunna - Space Cadet.jpg",
        genero: "Hip-Hop"
    },
    {
        id: 5,
        nome: "Eletrônica",
        descricao: "Para os amantes de música eletrônica",
        imagem: "Yot Club - YKWIM_.jpg",
        genero: "Eletrônica"
    },
    {
        id: 6,
        nome: "Jazz",
        descricao: "Comunidade para os apreciadores de Jazz",
        imagem: "../public/assets/images/playlist_capa_michael.jpg",
        genero: "Jazz"
    }
];

// Função para obter o caminho completo da imagem com codificação URL correta
function getImagePath(imagePath) {
    // Se já é um caminho completo, retorna como está
    if (imagePath.startsWith('../public/')) {
        return imagePath;
    }
    
    // Caso contrário, assume que é um arquivo de thumbnail e monta o caminho
    const encodedFileName = encodeURIComponent(imagePath);
    return `../public/assets/thumbnails/${encodedFileName}`;
}

// Elementos DOM
const gridComunidades = document.getElementById('comunidades-grid');
const tabEncontrar = document.querySelector('.aba-comunidade:nth-child(1)');
const tabSuas = document.querySelector('.aba-comunidade:nth-child(2)');
const filtrosBtns = document.querySelectorAll('.filtro-btn');

// Local storage key para comunidades participantes
const COMUNIDADES_STORAGE_KEY = 'nurva_comunidades_participantes';

// Função para verificar se o usuário participa de uma comunidade
function participaDaComunidade(comunidadeId) {
    const participantes = JSON.parse(localStorage.getItem(COMUNIDADES_STORAGE_KEY)) || [];
    return participantes.includes(comunidadeId);
}

// Função para alternar participação em uma comunidade
function alternarParticipacao(comunidadeId) {
    let participantes = JSON.parse(localStorage.getItem(COMUNIDADES_STORAGE_KEY)) || [];
    
    if (participaDaComunidade(comunidadeId)) {
        // Remove da lista de participantes
        participantes = participantes.filter(id => id !== comunidadeId);
    } else {
        // Adiciona à lista de participantes
        participantes.push(comunidadeId);
    }
    
    localStorage.setItem(COMUNIDADES_STORAGE_KEY, JSON.stringify(participantes));
    
    // Atualiza a exibição das comunidades
    if (tabSuas.classList.contains('ativo')) {
        mostrarSuasComunidades();
    } else {
        mostrarTodasComunidades();
    }
}

// Função para criar um card de comunidade
function criarCardComunidade(comunidade, index) {
    const participa = participaDaComunidade(comunidade.id);
    
    const card = document.createElement('div');
    card.className = 'comunidade-card';
    card.style.setProperty('--card-index', index);
    
    // Obtém o caminho completo da imagem
    const imagemPath = getImagePath(comunidade.imagem);
    
    card.innerHTML = `
        <div class="comunidade-imagem">
            <img src="${imagemPath}" alt="${comunidade.nome}" onerror="this.src='../public/assets/images/playlist_capa_beatles.jpg'">
        </div>
        <h3>${comunidade.nome}</h3>
        <p>${comunidade.descricao}</p>
        <button class="btn-entrar ${participa ? 'participando' : ''}" data-id="${comunidade.id}">
            ${participa ? 'Entrou' : 'Entrar'}
        </button>
    `;
    
    // Adiciona o evento de clique no botão
    const btnEntrar = card.querySelector('.btn-entrar');
    btnEntrar.addEventListener('click', () => {
        alternarParticipacao(comunidade.id);
        
        if (btnEntrar.classList.contains('participando')) {
            btnEntrar.classList.remove('participando');
            btnEntrar.textContent = 'Entrar';
        } else {
            btnEntrar.classList.add('participando');
            btnEntrar.textContent = 'Entrou';
        }
    });
    
    return card;
}

// Função para mostrar todas as comunidades (filtradas ou não)
function mostrarTodasComunidades(filtro = 'todos') {
    gridComunidades.innerHTML = '';
    
    let comunidadesFiltradas = comunidades;
    
    // Aplicar filtro se necessário
    if (filtro !== 'todos') {
        comunidadesFiltradas = comunidades.filter(comunidade => 
            comunidade.genero === filtro
        );
    }
    
    // Verifica se há comunidades para exibir
    if (comunidadesFiltradas.length === 0) {
        gridComunidades.innerHTML = `
            <div class="sem-comunidades">
                <div class="icone"><i class="fas fa-users-slash"></i></div>
                <h3>Nenhuma comunidade encontrada</h3>
                <p>Não encontramos comunidades com esse filtro. Tente outro gênero ou crie sua própria comunidade!</p>
            </div>
        `;
        return;
    }
    
    // Exibe as comunidades
    comunidadesFiltradas.forEach((comunidade, index) => {
        const card = criarCardComunidade(comunidade, index);
        gridComunidades.appendChild(card);
    });
}

// Função para mostrar apenas as comunidades que o usuário participa
function mostrarSuasComunidades() {
    gridComunidades.innerHTML = '';
    
    const participantes = JSON.parse(localStorage.getItem(COMUNIDADES_STORAGE_KEY)) || [];
    const minhasComunidades = comunidades.filter(comunidade => 
        participantes.includes(comunidade.id)
    );
    
    // Verifica se o usuário participa de alguma comunidade
    if (minhasComunidades.length === 0) {
        gridComunidades.innerHTML = `
            <div class="sem-comunidades">
                <div class="icone"><i class="fas fa-user-friends"></i></div>
                <h3>Você ainda não participa de nenhuma comunidade</h3>
                <p>Explore comunidades e participe para conectar-se com pessoas que compartilham seus gostos musicais!</p>
            </div>
        `;
        return;
    }
    
    // Exibe as comunidades do usuário
    minhasComunidades.forEach((comunidade, index) => {
        const card = criarCardComunidade(comunidade, index);
        gridComunidades.appendChild(card);
    });
}

// Eventos para as abas
tabEncontrar.addEventListener('click', () => {
    tabEncontrar.classList.add('ativo');
    tabSuas.classList.remove('ativo');
    mostrarTodasComunidades();
});

tabSuas.addEventListener('click', () => {
    tabSuas.classList.add('ativo');
    tabEncontrar.classList.remove('ativo');
    mostrarSuasComunidades();
});

// Eventos para os filtros de gênero
filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a classe ativo de todos os botões
        filtrosBtns.forEach(b => b.classList.remove('ativo'));
        
        // Adiciona a classe ativo ao botão clicado
        btn.classList.add('ativo');
        
        // Obtém o gênero a ser filtrado
        const genero = btn.textContent.trim();
        
        // Se estiver na aba "Encontrar Comunidades", filtra as comunidades
        if (tabEncontrar.classList.contains('ativo')) {
            if (genero === 'Para Você') {
                mostrarTodasComunidades('todos');
            } else {
                mostrarTodasComunidades(genero);
            }
        }
    });
});

// Função para buscar comunidades
function buscarComunidades(termo) {
    if (!termo) {
        mostrarTodasComunidades();
        return;
    }
    
    const termoBusca = termo.toLowerCase();
    const resultados = comunidades.filter(comunidade => 
        comunidade.nome.toLowerCase().includes(termoBusca) || 
        comunidade.descricao.toLowerCase().includes(termoBusca)
    );
    
    gridComunidades.innerHTML = '';
    
    if (resultados.length === 0) {
        gridComunidades.innerHTML = `
            <div class="sem-comunidades">
                <div class="icone"><i class="fas fa-search"></i></div>
                <h3>Nenhuma comunidade encontrada</h3>
                <p>Não encontramos comunidades com o termo "${termo}". Tente outra busca!</p>
            </div>
        `;
        return;
    }
    
    resultados.forEach((comunidade, index) => {
        const card = criarCardComunidade(comunidade, index);
        gridComunidades.appendChild(card);
    });
}

// Evento para a barra de pesquisa
const barraPesquisa = document.querySelector('.barra-pesquisa-comunidade input');
if (barraPesquisa) {
    barraPesquisa.addEventListener('input', (e) => {
        buscarComunidades(e.target.value);
    });
}

// Lista de thumbnails disponíveis para usar nas comunidades
const thumbnailsDisponiveis = [
    "Don Toliver - No Idea.jpg",
    "Travis Scott - goosebumps.jpg", 
    "Tyler， The Creator, Kali Uchis - See You Again.jpg",
    "Don Toliver - No Pole.jpg",
    "Miguel - Sure Thing.jpg",
    "The Weeknd, Playboi Carti - Timeless.jpg",
    "Yot Club - YKWIM_.jpg",
    "Metro Boomin, Gunna - Space Cadet.jpg",
    "NewJeans - Hype Boy.jpg",
    "XXXTENTACION - SAD!.jpg"
];

// Inicializa a página mostrando todas as comunidades
window.addEventListener('DOMContentLoaded', () => {
    console.log('Página de comunidades carregada');
    
    // Exibe todas as comunidades
    mostrarTodasComunidades();
    
    // Define a guia "Encontrar Comunidades" como ativa
    tabEncontrar.classList.add('ativo');
    tabSuas.classList.remove('ativo');
    
    // Define o filtro "Para Você" como ativo
    const filtroPadrao = document.querySelector('.filtro-btn:first-child');
    if (filtroPadrao) {
        filtroPadrao.classList.add('ativo');
    }
}); 