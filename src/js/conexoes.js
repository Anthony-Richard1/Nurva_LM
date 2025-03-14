// Dados de conexões existentes (matches com a sidebar)
const conexoesIniciais = [
    {
        id: 1,
        nome: "Bernardo",
        imagem: "../public/assets/images/usuario_bernardo.png",
        seguindo: true
    },
    {
        id: 2,
        nome: "Lívia",
        imagem: "../public/assets/images/usuario_livia.jpg",
        seguindo: true
    },
    {
        id: 3,
        nome: "Gustavo",
        imagem: "../public/assets/images/usuario_gustavo.jpg",
        seguindo: true
    },
    {
        id: 4,
        nome: "Bruna",
        imagem: "../public/assets/images/usuario_bruna.png",
        seguindo: true
    }
];

// Dados de sugestões com imagens de placeholder da internet
const sugestoesIniciais = [
    {
        id: 5,
        nome: "Connie",
        imagem: "https://randomuser.me/api/portraits/women/65.jpg",
        seguindo: false
    },
    {
        id: 6,
        nome: "Mitchell",
        imagem: "https://randomuser.me/api/portraits/men/32.jpg",
        seguindo: false
    },
    {
        id: 7,
        nome: "Ronald",
        imagem: "https://randomuser.me/api/portraits/men/45.jpg",
        seguindo: false
    },
    {
        id: 8,
        nome: "Aubrey",
        imagem: "https://randomuser.me/api/portraits/women/28.jpg",
        seguindo: false
    },
    {
        id: 9,
        nome: "Darrell",
        imagem: "https://randomuser.me/api/portraits/men/36.jpg",
        seguindo: false
    },
    {
        id: 10,
        nome: "Claire",
        imagem: "https://randomuser.me/api/portraits/women/17.jpg",
        seguindo: false
    },
    {
        id: 11,
        nome: "Cody",
        imagem: "https://randomuser.me/api/portraits/men/52.jpg",
        seguindo: false
    },
    {
        id: 12,
        nome: "Lee",
        imagem: "https://randomuser.me/api/portraits/men/78.jpg",
        seguindo: false
    }
];

// Para o segundo conjunto de sugestões (Eduardo, Cooper, Nguyen, Black)
const sugestoesSugestoesIniciais = [
    {
        id: 13,
        nome: "Eduardo",
        imagem: "https://randomuser.me/api/portraits/men/18.jpg",
        seguindo: false
    },
    {
        id: 14,
        nome: "Cooper",
        imagem: "https://randomuser.me/api/portraits/men/64.jpg",
        seguindo: false
    },
    {
        id: 15,
        nome: "Nguyen",
        imagem: "https://randomuser.me/api/portraits/men/42.jpg",
        seguindo: false
    },
    {
        id: 16,
        nome: "Black",
        imagem: "https://randomuser.me/api/portraits/men/29.jpg",
        seguindo: false
    }
];

// Alternativa de fallback usando UI Avatars (gerador de avatares baseado em iniciais)
function getFallbackAvatarUrl(nome) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random&color=fff&size=128`;
}

// Elementos DOM - centralizados em um único lugar
const listaConexoesEl = document.getElementById('lista-conexoes');
const sugestoesConexoesEl = document.getElementById('sugestoes-conexoes');
const barraPesquisaEl = document.querySelector('.barra-pesquisa-conexoes input');
const barraPesquisaPainelEl = document.getElementById('pesquisa-usuario');

// Classe para gerenciar as conexões
class ConexoesManager {
    constructor() {
        this.conexoes = this.carregarConexoesDoLocalStorage() || [...conexoesIniciais];
        this.sugestoes = this.carregarSugestoesDoLocalStorage() || 
                          [...sugestoesIniciais, ...sugestoesSugestoesIniciais];
        this.filtro = '';
        this.animationsEnabled = true; // Controla se as animações estão ativadas
    }

    // Carregar conexões do localStorage
    carregarConexoesDoLocalStorage() {
        const conexoes = localStorage.getItem('nurva_conexoes');
        return conexoes ? JSON.parse(conexoes) : null;
    }

    // Carregar sugestões do localStorage
    carregarSugestoesDoLocalStorage() {
        const sugestoes = localStorage.getItem('nurva_sugestoes');
        return sugestoes ? JSON.parse(sugestoes) : null;
    }

    // Salvar conexões no localStorage
    salvarConexoesNoLocalStorage() {
        localStorage.setItem('nurva_conexoes', JSON.stringify(this.conexoes));
    }

    // Salvar sugestões no localStorage
    salvarSugestoesNoLocalStorage() {
        localStorage.setItem('nurva_sugestoes', JSON.stringify(this.sugestoes));
    }

    // Aplicar filtro de pesquisa
    aplicarFiltro(termo) {
        this.filtro = termo.toLowerCase();
        this.animationsEnabled = false; // Desativa animações durante filtros para melhor UX
        this.renderizarConexoes();
        this.renderizarSugestoes();
        
        // Reativa animações após 1 segundo
        setTimeout(() => {
            this.animationsEnabled = true;
        }, 1000);
    }

    // Anima a transição entre listas
    animarTransicao(elemento, destino, callback) {
        if (!elemento || !this.animationsEnabled) {
            callback();
            return;
        }
        
        elemento.style.transition = 'all 0.3s ease';
        elemento.style.transform = 'scale(0.8)';
        elemento.style.opacity = '0';
        
        setTimeout(() => {
            callback();
        }, 300);
    }

    // Seguir uma conexão
    seguirConexao(id, btnElement) {
        if (btnElement) {
            // Feedback visual imediato
            btnElement.textContent = "Seguindo";
            btnElement.classList.add('seguindo');
            btnElement.disabled = true;
            
            // Adiciona efeito de pulso no botão
            btnElement.style.animation = 'pulse 0.5s ease';
        }

        // Encontra o card pai para animação
        const cardElement = btnElement ? btnElement.closest('.conexao-card') : null;
        
        // Verificar se é uma sugestão
        const sugestaoIndex = this.sugestoes.findIndex(s => s.id === id);
        if (sugestaoIndex !== -1) {
            const sugestao = this.sugestoes[sugestaoIndex];
            sugestao.seguindo = true;
            
            // Animar a transição visual
            this.animarTransicao(cardElement, 'conexoes', () => {
                // Adicionar às conexões e remover das sugestões
                this.conexoes.push(sugestao);
                this.sugestoes.splice(sugestaoIndex, 1);
                
                this.salvarConexoesNoLocalStorage();
                this.salvarSugestoesNoLocalStorage();
                this.renderizarConexoes();
                this.renderizarSugestoes();
                
                // Notificação visual de sucesso
                this.mostrarNotificacao(`Você agora segue ${sugestao.nome}!`);
            });
        } else {
            // Caso já seja uma conexão, deve ser um toggle (deixar de seguir)
            const conexaoIndex = this.conexoes.findIndex(c => c.id === id);
            if (conexaoIndex !== -1) {
                const conexao = this.conexoes[conexaoIndex];
                conexao.seguindo = true;
                
                this.salvarConexoesNoLocalStorage();
                this.renderizarConexoes();
            }
        }
    }

    // Deixar de seguir uma conexão
    deixarDeSeguir(id, btnElement) {
        if (btnElement) {
            // Feedback visual imediato
            btnElement.textContent = "Conectar";
            btnElement.classList.remove('seguindo');
            btnElement.disabled = true;
        }

        // Encontra o card pai para animação
        const cardElement = btnElement ? btnElement.closest('.conexao-card') : null;
        
        const conexaoIndex = this.conexoes.findIndex(c => c.id === id);
        if (conexaoIndex !== -1) {
            const conexao = this.conexoes[conexaoIndex];
            
            // Animar a transição visual
            this.animarTransicao(cardElement, 'sugestoes', () => {
                // Remover das conexões e adicionar às sugestões
                this.conexoes.splice(conexaoIndex, 1);
                conexao.seguindo = false;
                this.sugestoes.push(conexao);
                
                this.salvarConexoesNoLocalStorage();
                this.salvarSugestoesNoLocalStorage();
                this.renderizarConexoes();
                this.renderizarSugestoes();
                
                // Notificação visual
                this.mostrarNotificacao(`Você deixou de seguir ${conexao.nome}`, 'erro');
            });
        }
    }

    // Exibir notificação temporária
    mostrarNotificacao(mensagem, tipo = 'sucesso') {
        // Verifica se já existe uma notificação
        let notificacaoEl = document.querySelector('.conexoes-notificacao');
        
        if (!notificacaoEl) {
            // Cria o elemento de notificação
            notificacaoEl = document.createElement('div');
            notificacaoEl.className = 'conexoes-notificacao';
            document.body.appendChild(notificacaoEl);
        }
        
        // Atualiza o conteúdo e exibe
        notificacaoEl.textContent = mensagem;
        notificacaoEl.classList.add('ativa');
        
        // Aplica classe de erro se for o caso
        if (tipo === 'erro') {
            notificacaoEl.classList.add('erro');
        } else {
            notificacaoEl.classList.remove('erro');
        }
        
        // Remove após 3 segundos
        setTimeout(() => {
            notificacaoEl.classList.remove('ativa');
        }, 3000);
    }

    // Renderizar as conexões na página
    renderizarConexoes() {
        if (!listaConexoesEl) return;
        
        listaConexoesEl.innerHTML = '';
        
        const conexoesFiltradas = this.filtro 
            ? this.conexoes.filter(c => c.nome.toLowerCase().includes(this.filtro))
            : this.conexoes;
        
        if (conexoesFiltradas.length === 0) {
            listaConexoesEl.innerHTML = '<p class="sem-conexoes">Nenhuma conexão encontrada</p>';
            return;
        }
        
        conexoesFiltradas.forEach((conexao, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'conexao-card';
            
            // Só aplica as animações se estiverem ativadas
            if (this.animationsEnabled) {
                cardEl.style.setProperty('--card-index', index);
            } else {
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0)';
            }
            
            cardEl.innerHTML = `
                <div class="conexao-imagem">
                    <img src="${conexao.imagem}" alt="${conexao.nome}" 
                         onerror="this.src='${getFallbackAvatarUrl(conexao.nome)}'">
                </div>
                <div class="conexao-nome">${conexao.nome}</div>
                <button class="btn-conectar seguindo" data-id="${conexao.id}">Seguindo</button>
            `;
            
            listaConexoesEl.appendChild(cardEl);
        });
        
        // Adicionar event listeners para os botões
        document.querySelectorAll('#lista-conexoes .btn-conectar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deixarDeSeguir(id, e.target);
            });
        });
    }

    // Renderizar as sugestões na página
    renderizarSugestoes() {
        if (!sugestoesConexoesEl) return;
        
        sugestoesConexoesEl.innerHTML = '';
        
        const sugestoesFiltradas = this.filtro 
            ? this.sugestoes.filter(s => s.nome.toLowerCase().includes(this.filtro))
            : this.sugestoes;
        
        if (sugestoesFiltradas.length === 0 && !this.filtro) {
            sugestoesConexoesEl.innerHTML = '<p class="sem-sugestoes">Não há mais sugestões disponíveis no momento</p>';
            return;
        } else if (sugestoesFiltradas.length === 0) {
            sugestoesConexoesEl.innerHTML = '<p class="sem-sugestoes">Nenhuma sugestão encontrada para este termo</p>';
            return;
        }
        
        sugestoesFiltradas.forEach((sugestao, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'conexao-card';
            
            // Só aplica as animações se estiverem ativadas
            if (this.animationsEnabled) {
                cardEl.style.setProperty('--card-index', index);
            } else {
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0)';
            }
            
            cardEl.innerHTML = `
                <div class="conexao-imagem">
                    <img src="${sugestao.imagem}" alt="${sugestao.nome}" 
                         onerror="this.src='${getFallbackAvatarUrl(sugestao.nome)}'">
                </div>
                <div class="conexao-nome">${sugestao.nome}</div>
                <button class="btn-conectar" data-id="${sugestao.id}">Conectar</button>
            `;
            
            sugestoesConexoesEl.appendChild(cardEl);
        });
        
        // Adicionar event listeners para os botões
        document.querySelectorAll('#sugestoes-conexoes .btn-conectar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.seguirConexao(id, e.target);
            });
        });
    }
}

// Definição do estilo para notificações
const estiloNotificacao = document.createElement('style');
estiloNotificacao.textContent = `
    .conexoes-notificacao {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(52, 52, 52, 0.85);
        color: white;
        padding: 12px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        border: 1px solid rgba(255, 255, 255, 0.15);
        min-width: 200px;
        text-align: center;
    }

    .conexoes-notificacao.ativa {
        bottom: 30px;
        opacity: 1;
    }
    
    .conexoes-notificacao.erro {
        background-color: rgba(220, 53, 69, 0.85);
    }

    .conexoes-notificacao::before {
        content: '\\f058';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        margin-right: 8px;
        font-size: 14px;
    }
    
    .conexoes-notificacao.erro::before {
        content: '\\f057';
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(estiloNotificacao);

// Inicializar o gerenciador de conexões - única instância
const conexoesManager = new ConexoesManager();

// Renderizar as conexões e sugestões iniciais - único event listener
document.addEventListener('DOMContentLoaded', () => {
    conexoesManager.renderizarConexoes();
    conexoesManager.renderizarSugestoes();
    
    // Configurar a barra de pesquisa principal (caso ainda exista)
    if (barraPesquisaEl) {
        barraPesquisaEl.addEventListener('input', (e) => {
            conexoesManager.aplicarFiltro(e.target.value);
        });
    }
    
    // Configurar a barra de pesquisa dentro do painel
    if (barraPesquisaPainelEl) {
        barraPesquisaPainelEl.addEventListener('input', (e) => {
            const valor = e.target.value;
            conexoesManager.aplicarFiltro(valor);
            
            // Adicionar/remover classe para mostrar ícone de limpar
            const container = barraPesquisaPainelEl.closest('.barra-pesquisa-painel');
            if (valor.length > 0) {
                container.classList.add('has-text');
            } else {
                container.classList.remove('has-text');
            }
        });
        
        // Adicionar listener para o ícone de limpar
        const container = barraPesquisaPainelEl.closest('.barra-pesquisa-painel');
        container.addEventListener('click', (e) => {
            // Se o clique foi no ícone de limpar (o pseudo-elemento ::after)
            const rect = container.getBoundingClientRect();
            const isClickOnClearIcon = (e.clientX > rect.right - 30);
            
            if (isClickOnClearIcon && barraPesquisaPainelEl.value.length > 0) {
                barraPesquisaPainelEl.value = '';
                container.classList.remove('has-text');
                conexoesManager.aplicarFiltro('');
                
                // Foco no campo de pesquisa após limpar
                barraPesquisaPainelEl.focus();
            }
        });
    }
    
    // Se a página foi carregada com um parâmetro de busca na URL, aplicar o filtro
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    
    if (searchTerm) {
        // Aplicar o termo de pesquisa à barra dentro do painel
        if (barraPesquisaPainelEl) {
            barraPesquisaPainelEl.value = searchTerm;
            const container = barraPesquisaPainelEl.closest('.barra-pesquisa-painel');
            if (searchTerm.length > 0) {
                container.classList.add('has-text');
            }
        }
        
        // Aplicar o termo de pesquisa à barra fora do painel (caso ainda exista)
        if (barraPesquisaEl) {
            barraPesquisaEl.value = searchTerm;
        }
        
        // Aplicar o filtro
        conexoesManager.aplicarFiltro(searchTerm);
    }
}); 