// Script para processar automaticamente os arquivos MP3 da pasta assets/music
// Salve este arquivo na raiz do seu projeto e execute com: node processMusic.js

const fs = require('fs');
const path = require('path');
const jsmediatags = require('jsmediatags');
const { promisify } = require('util');

// Diretórios
const MUSIC_DIR = path.join(__dirname, 'assets', 'music');
const OUTPUT_FILE = path.join(__dirname, 'assets', 'js', 'musicdata.js');

// Função para ler as tags de um arquivo MP3
function readTags(filePath) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(filePath, {
      onSuccess: (tag) => resolve(tag),
      onError: (error) => reject(error)
    });
  });
}

// Função para converter um array buffer para base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

// Função principal para processar os arquivos de música
async function processMusic() {
  console.log('Iniciando processamento de arquivos de música...');
  
  // Verificar se o diretório de música existe
  if (!fs.existsSync(MUSIC_DIR)) {
    console.error(`Diretório de música não encontrado: ${MUSIC_DIR}`);
    console.error('Criando o diretório...');
    fs.mkdirSync(MUSIC_DIR, { recursive: true });
    console.log(`Diretório criado. Por favor, adicione suas músicas MP3 em: ${MUSIC_DIR}`);
    return;
  }
  
  // Ler todos os arquivos no diretório de música
  const files = fs.readdirSync(MUSIC_DIR);
  const mp3Files = files.filter(file => file.toLowerCase().endsWith('.mp3'));
  
  if (mp3Files.length === 0) {
    console.error('Nenhum arquivo MP3 encontrado no diretório de música.');
    return;
  }
  
  console.log(`Encontrados ${mp3Files.length} arquivos MP3.`);
  
  // Processar cada arquivo MP3
  const musicDatabase = [];
  
  for (let i = 0; i < mp3Files.length; i++) {
    const fileName = mp3Files[i];
    const filePath = path.join(MUSIC_DIR, fileName);
    
    console.log(`Processando (${i + 1}/${mp3Files.length}): ${fileName}`);
    
    try {
      // Ler tags do arquivo
      const tag = await readTags(filePath);
      const tags = tag.tags;
      
      // Extrair thumbnail (se disponível)
      let thumbnailUrl = '';
      let thumbnailFileName = '';
      
      if (tags.picture) {
        const { data, format } = tags.picture;
        const base64String = arrayBufferToBase64(data);
        
        // Gerar nome do arquivo para a thumbnail
        thumbnailFileName = `${path.parse(fileName).name}.jpg`;
        const thumbnailPath = path.join(__dirname, 'assets', 'thumbnails', thumbnailFileName);
        
        // Salvar a thumbnail como arquivo
        const thumbnailDir = path.dirname(thumbnailPath);
        if (!fs.existsSync(thumbnailDir)) {
          fs.mkdirSync(thumbnailDir, { recursive: true });
        }
        
        fs.writeFileSync(
          thumbnailPath, 
          Buffer.from(base64String, 'base64')
        );
        
        thumbnailUrl = `assets/thumbnails/${thumbnailFileName}`;
        console.log(`Thumbnail extraída e salva: ${thumbnailUrl}`);
      } else {
        thumbnailUrl = 'assets/thumbnails/default.jpg';
        
        // Verificar se existe o arquivo default.jpg, se não, criar
        const defaultThumbPath = path.join(__dirname, 'assets', 'thumbnails', 'default.jpg');
        const defaultThumbDir = path.dirname(defaultThumbPath);
        
        if (!fs.existsSync(defaultThumbDir)) {
          fs.mkdirSync(defaultThumbDir, { recursive: true });
        }
        
        if (!fs.existsSync(defaultThumbPath)) {
          // Criando uma imagem preta simples como default
          const defaultImageData = 
            'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTAzLTEwVDEyOjA5OjA4LTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wMy0xMFQxMjoxMDoxMC0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wMy0xMFQxMjoxMDoxMC0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ZWJiM2IxZi03OWVlLTQ4NDctYWNhMi1hMDg3MzJiNmNjZjYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0MDJjOTFiMS0xMzYwLTE5NGItYWE2ZC1mZjlkODRmODRkMmMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3Y2Y4MzA2ZS1lMDVlLTQ2NDMtODM4Yi00ZWY1Y2RiOTMxOGUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdjZjgzMDZlLWUwNWUtNDY0My04MzhiLTRlZjVjZGI5MzE4ZSIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0xMFQxMjowOTowOC0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZWJiM2IxZi03OWVlLTQ4NDctYWNhMi1hMDg3MzJiNmNjZjYiIHN0RXZ0OndoZW49IjIwMjMtMDMtMTBUMTI6MTA6MTAtMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5TTCWgAAAJZklEQVR42u3dMW8bVxbA8XOXboJUQde2wGazKhJkC1eMiuzcuIlE6Eu6/YKFWu0XoBu12m/gLtWqu1RbFGnsLl12JgqRgHVWxQIbYA3kAAnwvpkh/TRN3L0zfJLI+/8BAiJHpB6HOL/75s2bO11KKVGMNT90G4c/tKbnwkwXXc9HH5dluZplma7r2tfI8xzXi6jrusSd8MTpdPp1lmXtdFoeGi9/Ho1Gj0Wq1Wr5R6PRlWEYXLRNDXo+cWTbttxdrBf7tWqPx+PR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';
          
          fs.writeFileSync(
            defaultThumbPath, 
            Buffer.from(defaultImageData, 'base64')
          );
          
          console.log('Imagem padrão criada em: ' + defaultThumbPath);
        }
      }
      
      // Criar entrada no banco de dados
      const song = {
        id: i + 1,
        title: tags.title || fileName.replace('.mp3', ''),
        artist: tags.artist || 'Artista Desconhecido',
        album: tags.album || 'Álbum Desconhecido',
        year: tags.year || '',
        genre: tags.genre || '',
        thumbnail: thumbnailUrl,
        audioPath: `assets/music/${fileName}`,
        fileName: fileName
      };
      
      musicDatabase.push(song);
      
    } catch (error) {
      console.error(`Erro ao processar ${fileName}:`, error.message);
      
      // Mesmo com erro, criar uma entrada básica
      const song = {
        id: i + 1,
        title: fileName.replace('.mp3', ''),
        artist: 'Artista Desconhecido',
        album: 'Álbum Desconhecido',
        year: '',
        genre: '',
        thumbnail: 'assets/thumbnails/default.jpg',
        audioPath: `assets/music/${fileName}`,
        fileName: fileName
      };
      
      musicDatabase.push(song);
    }
  }
  
  // Criar playlists básicas
  const playlists = {
    favorites: [],
    recentlyPlayed: []
  };
  
  // Gerar o arquivo JavaScript com os dados
  const jsContent = `// Banco de dados de músicas local - gerado automaticamente
// Última atualização: ${new Date().toLocaleString()}

const musicDatabase = ${JSON.stringify(musicDatabase, null, 2)};

// Você pode organizar as músicas por gênero, playlists, etc.
const playlists = ${JSON.stringify(playlists, null, 2)};

// Função simples para buscar todas as músicas
function getAllSongs() {
  return musicDatabase;
}

// Função para buscar músicas por gênero
function getSongsByGenre(genre) {
  return musicDatabase.filter(song => song.genre && song.genre.toLowerCase() === genre.toLowerCase());
}

// Função para buscar uma playlist específica
function getPlaylist(playlistName) {
  const playlistIds = playlists[playlistName] || [];
  return playlistIds.map(id => musicDatabase.find(song => song.id === id)).filter(Boolean);
}

// Função para buscar uma música por ID
function getSongById(id) {
  return musicDatabase.find(song => song.id === id);
}`;

  // Garantir que o diretório de saída existe
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Salvar o arquivo JavaScript
  fs.writeFileSync(OUTPUT_FILE, jsContent);
  
  console.log(`Processamento concluído! ${mp3Files.length} música(s) processada(s).`);
  console.log(`Banco de dados gerado em: ${OUTPUT_FILE}`);
}

// Executar o script
processMusic()
  .then(() => {
    console.log('Script concluído com sucesso!');
  })
  .catch(error => {
    console.error('Erro durante a execução do script:', error);
  }); 