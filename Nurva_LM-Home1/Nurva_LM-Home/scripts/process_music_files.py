#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Script para processar arquivos de música e seus metadados JSON
# Como usar: python process_music_files.py

import os
import json
import shutil
import glob
from datetime import datetime
import re

# Diretórios
TEMP_DIR = "temp_download"  # Onde estão os arquivos .info.json e possivelmente os MP3
OUTPUT_MUSIC_DIR = "assets/music"  # Onde serão colocados os arquivos MP3
OUTPUT_THUMBNAILS_DIR = "assets/thumbnails"  # Onde serão colocadas as imagens
OUTPUT_JS_FILE = "assets/js/musicdata.js"  # Arquivo final JS

# Criar diretórios se não existirem
os.makedirs(OUTPUT_MUSIC_DIR, exist_ok=True)
os.makedirs(OUTPUT_THUMBNAILS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_JS_FILE), exist_ok=True)

# Extensões de arquivos de música a procurar (case insensitive)
MUSIC_EXTENSIONS = [".mp3", ".m4a", ".webm", ".opus"]

def clean_filename(filename):
    """Remove caracteres inválidos de nomes de arquivo"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename.strip()

def find_music_file_improved(base_name):
    """Versão melhorada para encontrar o arquivo de música correspondente ao JSON"""
    # Listar todos os arquivos na pasta temp_download
    all_files = os.listdir(TEMP_DIR)
    
    # Filtrar apenas arquivos de áudio com extensões conhecidas
    audio_files = []
    for file in all_files:
        ext = os.path.splitext(file)[1].lower()
        if ext in MUSIC_EXTENSIONS:
            audio_files.append(file)
    
    # Procurar correspondência exata
    for file in audio_files:
        file_base = os.path.splitext(file)[0]
        if file_base == base_name:
            return os.path.join(TEMP_DIR, file)
    
    # Procurar por correspondência onde o nome do JSON é parte do nome do arquivo
    for file in audio_files:
        if base_name in file:
            return os.path.join(TEMP_DIR, file)
    
    # Procurar por correspondência onde o nome do arquivo é parte do nome do JSON
    for file in audio_files:
        file_base = os.path.splitext(file)[0]
        if file_base in base_name:
            return os.path.join(TEMP_DIR, file)
    
    # Remover caracteres especiais e tentar novamente
    clean_base = re.sub(r'[^\w\s]', '', base_name).lower()
    for file in audio_files:
        clean_file = re.sub(r'[^\w\s]', '', os.path.splitext(file)[0]).lower()
        
        if clean_base == clean_file or clean_base in clean_file or clean_file in clean_base:
            return os.path.join(TEMP_DIR, file)
    
    # Se tudo falhar, retorne None
    return None

def process_json_files(only_thumbnails=False):
    """Processa todos os arquivos .info.json na pasta temp_download"""
    music_database = []
    json_files = glob.glob(os.path.join(TEMP_DIR, "*.info.json"))
    
    print(f"Encontrados {len(json_files)} arquivos JSON para processar.")
    
    # Criar uma lista de associações de arquivos JSON e MP3 encontrados
    file_associations = {}
    
    # Primeiro passo: vamos encontrar todos os pares de arquivos
    for json_file in json_files:
        base_name = os.path.splitext(os.path.basename(json_file))[0]
        if not only_thumbnails:
            music_file = find_music_file_improved(base_name)
            if music_file:
                file_associations[json_file] = music_file
        else:
            # No modo apenas thumbnails, processamos todos os JSONs independente dos arquivos de música
            file_associations[json_file] = None
    
    if not only_thumbnails:
        print(f"Encontrados {len(file_associations)} pares de arquivos JSON/MP3.")
    else:
        print(f"Processando {len(file_associations)} arquivos JSON para thumbnails.")
    
    # Segundo passo: processar os pares encontrados
    for i, (json_file, music_file) in enumerate(file_associations.items(), 1):
        base_name = os.path.splitext(os.path.basename(json_file))[0]
        print(f"Processando ({i}/{len(file_associations)}): {base_name}")
        
        try:
            # Carregar o JSON
            with open(json_file, 'r', encoding='utf-8') as f:
                info = json.load(f)
            
            # Extrair informações
            title = info.get('title', base_name)
            uploader = info.get('uploader', '')
            artist = info.get('artist', uploader)
            album = info.get('album', '')
            
            # Se não tiver artista, tentar extrair do título
            if not artist and ' - ' in title:
                parts = title.split(' - ', 1)
                artist = parts[0].strip()
                title = parts[1].strip()
            
            # Nomes de arquivo limpos
            clean_title = clean_filename(title)
            clean_artist = clean_filename(artist)
            
            # Novo nome para o arquivo MP3
            new_filename = f"{clean_artist} - {clean_title}".strip()
            if new_filename.startswith(" - "):
                new_filename = new_filename[3:]
            if new_filename.endswith(" - "):
                new_filename = new_filename[:-3]
                
            new_filename = clean_filename(new_filename)
            if not new_filename:
                new_filename = clean_filename(base_name)
            
            # Processar thumbnail
            thumbnail_filename = f"{new_filename}.jpg"
            thumbnail_path = os.path.join(OUTPUT_THUMBNAILS_DIR, thumbnail_filename)
            
            # Verificar se há arquivo de thumbnail local (.webp, .jpg, .png)
            thumbnail_downloaded = False
            potential_thumbs = [
                os.path.join(TEMP_DIR, base_name + ".webp"),
                os.path.join(TEMP_DIR, base_name + ".jpg"),
                os.path.join(TEMP_DIR, base_name + ".png")
            ]
            
            for thumb in potential_thumbs:
                if os.path.exists(thumb):
                    # Copiar thumbnail para a pasta de destino
                    shutil.copy2(thumb, thumbnail_path)
                    thumbnail_downloaded = True
                    print(f"✓ Copiada thumbnail: {thumbnail_filename}")
                    break
            
            if not thumbnail_downloaded:
                # Usar thumbnail padrão
                thumbnail_path = "assets/thumbnails/default.jpg"
                print(f"⚠️ Usando thumbnail padrão para: {new_filename}")
                
                # Verificar se existe a imagem padrão, se não, criar uma
                default_thumb = os.path.join(OUTPUT_THUMBNAILS_DIR, "default.jpg")
                if not os.path.exists(default_thumb):
                    # Criar um arquivo de imagem padrão simples
                    with open(default_thumb, 'w') as f:
                        f.write("<!-- Imagem padrão -->")
                    print("✓ Criada thumbnail padrão")
            
            # Se estamos apenas processando thumbnails, pulamos o resto
            if only_thumbnails:
                continue
            
            # Extensão do arquivo de música
            _, music_ext = os.path.splitext(music_file)
            new_music_filename = f"{new_filename}{music_ext}"
            
            # Copiar arquivo de música
            destination = os.path.join(OUTPUT_MUSIC_DIR, new_music_filename)
            shutil.copy2(music_file, destination)
            print(f"✓ Copiado arquivo de música: {new_music_filename}")
            
            # Calcular duração em minutos:segundos
            duration = info.get('duration', 0)
            if duration:
                minutes = int(duration) // 60
                seconds = int(duration) % 60
                duration_str = f"{minutes}:{seconds:02d}"
            else:
                duration_str = "0:00"
            
            # Adicionar ao banco de dados
            song_entry = {
                "id": i,
                "title": title,
                "artist": artist,
                "album": album or "Álbum Desconhecido",
                "year": info.get('upload_date', '')[:4] if info.get('upload_date', '') else '',
                "duration": duration_str,
                "genre": info.get('genre', ''),
                "thumbnail": thumbnail_path,
                "audioPath": f"assets/music/{new_music_filename}",
                "fileName": new_music_filename
            }
            
            music_database.append(song_entry)
            
        except Exception as e:
            print(f"❌ Erro ao processar {base_name}: {str(e)}")
    
    return music_database

def generate_js_file(music_database):
    """Gera o arquivo JS com o banco de dados de músicas"""
    # Playlists básicas
    playlists = {
        "favorites": [],
        "recentlyPlayed": []
    }
    
    # Gerar o arquivo JavaScript
    js_content = f"""// Banco de dados de músicas local - gerado automaticamente
// Última atualização: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}

const musicDatabase = {json.dumps(music_database, indent=2, ensure_ascii=False)};

// Você pode organizar as músicas por gênero, playlists, etc.
const playlists = {json.dumps(playlists, indent=2, ensure_ascii=False)};

// Função simples para buscar todas as músicas
function getAllSongs() {{
  return musicDatabase;
}}

// Função para buscar músicas por gênero
function getSongsByGenre(genre) {{
  return musicDatabase.filter(song => song.genre && song.genre.toLowerCase() === genre.toLowerCase());
}}

// Função para buscar uma playlist específica
function getPlaylist(playlistName) {{
  const playlistIds = playlists[playlistName] || [];
  return playlistIds.map(id => musicDatabase.find(song => song.id === id)).filter(Boolean);
}}

// Função para buscar uma música por ID
function getSongById(id) {{
  return musicDatabase.find(song => song.id === id);
}}"""

    # Salvar o arquivo
    with open(OUTPUT_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n✅ Banco de dados gerado em: {OUTPUT_JS_FILE}")
    print(f"✅ Total de músicas processadas: {len(music_database)}")

def main():
    print("🎵 Iniciando processamento de músicas...")
    
    # Verificar se queremos apenas processar thumbnails
    only_thumbnails = True  # Definir como True para processar apenas thumbnails
    
    if only_thumbnails:
        print("🖼️ Modo de processamento apenas de thumbnails ativado")
        process_json_files(only_thumbnails=True)
        print("\n✨ Processamento de thumbnails concluído! ✨")
    else:
        music_database = process_json_files()
        
        # Ordenar por título
        music_database.sort(key=lambda x: x['title'].lower())
        
        # Reatribuir IDs após ordenação
        for i, song in enumerate(music_database, 1):
            song['id'] = i
        
        if music_database:
            generate_js_file(music_database)
            print("\n✨ Processamento completo concluído com sucesso! ✨")
        else:
            print("\n❌ Nenhuma música foi processada. Verifique os arquivos de entrada.")

if __name__ == "__main__":
    main() 