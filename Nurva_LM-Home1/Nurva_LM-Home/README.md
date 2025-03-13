# Nurva - Plataforma de Música

Projeto da disciplina de Linguagem de Marcação. Nurva é uma plataforma web de música que permite aos usuários ouvir músicas, criar playlists e conectar-se com amigos.

## Estrutura do Projeto

```
Nurva_LM/
├── public/
│   ├── assets/
│   │   ├── images/        (imagens do site)
│   │   ├── music/         (arquivos de música)
│   │   ├── thumbnails/    (miniaturas de músicas)
├── src/
│   ├── js/
│   │   ├── feed.js        (gerenciamento do feed)
│   │   ├── main.js        (funcionalidades principais)
│   │   ├── musicdata.js   (banco de dados de músicas)
│   │   ├── musicManager.js (gerenciamento de músicas)
│   │   ├── player.js      (reprodutor de música)
│   ├── css/
│   │   ├── components/
│   │   │   ├── cards.css      (estilos dos cards de música, artista, album)
│   │   │   ├── player.css     (estilos do player)
│   │   │   ├── navigation.css (barra de navegação)
│   │   │   ├── feed.css       (estilos do feed)
│   │   ├── pages/
│   │   │   ├── explorar.css   (estilos da página explorar)
│   │   │   ├── perfil.css     (estilos da página de perfil)
│   │   │   ├── comunidade.css (estilos da página de comunidade)
│   │   ├── layout.css         (layout geral)
│   │   ├── styles.css         (estilos gerais e importações)
│   ├── components/            (componentes reutilizáveis)
├── pages/
│   ├── explorar.html          (página explorar)
│   ├── comunidade.html        (página comunidade)
│   ├── perfil.html            (página perfil)
├── scripts/
│   ├── process_music_files.py (processamento de arquivos de música)
│   ├── process_thumbnails.py  (processamento de thumbnails)
│   ├── update_thumbnails.py   (atualização de thumbnails)
│   ├── processMusic.js        (processamento de músicas em JS)
├── index.html                 (página home)
```

## Funcionalidades Implementadas

- Layout responsivo que funciona em diferentes tamanhos de tela
- Cards de músicas e artistas com efeito morph glass
- Player de música totalmente funcional
- Barra lateral com conexões ativas e playlists
- Área de pesquisa
- Menu de navegação
- Feed de músicas e artistas
- Reprodução de músicas a partir do banco de dados local

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Python (para scripts de processamento)
- Font Awesome para ícones

## Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` no navegador
3. Para processar novos arquivos de música, use os scripts na pasta `scripts/`

## Próximos Passos

- Implementar funcionalidades de interação social
- Melhorar a experiência mobile
- Adicionar recursos de personalização
- Implementar recursos de upload de músicas e playlists personalizadas

## Autores

- Anthony Richard 
