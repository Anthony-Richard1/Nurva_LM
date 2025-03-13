#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Script para atualizar o banco de dados de músicas com as thumbnails
# Como usar: python update_thumbnails.py

import os
import re

# Diretórios
OUTPUT_THUMBNAILS_DIR = "assets/thumbnails"
OUTPUT_JS_FILE = "assets/js/musicdata.js"

def update_thumbnails():
    """Atualiza todas as referências de thumbnails no musicdata.js"""
    if not os.path.exists(OUTPUT_JS_FILE):
        print(f"Arquivo {OUTPUT_JS_FILE} não encontrado.")
        return False
    
    # Obter lista de thumbnails disponíveis
    thumbnails = {}
    for filename in os.listdir(OUTPUT_THUMBNAILS_DIR):
        if filename.endswith('.jpg'):
            # Obter nome base (sem extensão)
            base_name = os.path.splitext(filename)[0]
            thumbnails[base_name] = f"assets/thumbnails/{filename}"
    
    print(f"Encontradas {len(thumbnails)} thumbnails para utilizar.")
    
    # Ler o arquivo musicdata.js
    with open(OUTPUT_JS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Contador de substituições
    updated_count = 0
    
    # Localizar todos os padrões do tipo:
    # "title": "Nome da Música",
    # ... linhas ...
    # "thumbnail": "assets/thumbnails/default.jpg",
    
    title_pattern = r'"title":\s*"([^"]+)"'
    artist_pattern = r'"artist":\s*"([^"]+)"'
    default_thumb_pattern = r'"thumbnail":\s*"assets/thumbnails/default.jpg"'
    
    # Encontrar todas as ocorrências do padrão de título
    title_matches = list(re.finditer(title_pattern, content))
    
    # Processar cada ocorrência
    for match in title_matches:
        title = match.group(1)
        title_pos = match.start()
        
        # Encontrar o artista mais próximo após o título
        artist_search = re.search(artist_pattern, content[title_pos:title_pos+500])
        artist = artist_search.group(1) if artist_search else ""
        
        # Encontrar a próxima ocorrência de thumbnail padrão após o título
        thumb_search = re.search(default_thumb_pattern, content[title_pos:title_pos+500])
        
        if thumb_search:
            thumb_pos = title_pos + thumb_search.start()
            
            # Tentar diferentes formatos para encontrar a thumbnail
            found_thumbnail = None
            
            # Formato 1: Artista - Título
            if artist:
                pattern1 = f"{artist} - {title}"
                clean_pattern1 = "".join(c if c not in '<>:"/\\|?*' else '_' for c in pattern1)
                if clean_pattern1 in thumbnails:
                    found_thumbnail = thumbnails[clean_pattern1]
            
            # Formato 2: Apenas Título
            if not found_thumbnail and title in thumbnails:
                found_thumbnail = thumbnails[title]
            
            # Formato 3: Apenas buscar por correspondência parcial
            if not found_thumbnail:
                for thumb_name in thumbnails:
                    # Verificar se o título está contido no nome da thumb
                    if title in thumb_name or (artist and artist in thumb_name):
                        found_thumbnail = thumbnails[thumb_name]
                        break
            
            # Se encontrou uma thumbnail, fazer a substituição
            if found_thumbnail:
                old_text = '"thumbnail": "assets/thumbnails/default.jpg"'
                new_text = f'"thumbnail": "{found_thumbnail}"'
                
                # Substituir apenas nessa posição específica
                content = content[:thumb_pos] + new_text + content[thumb_pos+len(old_text):]
                updated_count += 1
                print(f"✓ Atualizada thumbnail para: {title} ({found_thumbnail})")
    
    # Se foram encontradas atualizações, salvar o arquivo atualizado
    if updated_count > 0:
        with open(OUTPUT_JS_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ Atualizadas {updated_count} entradas no banco de dados.")
        return True
    else:
        print("\n⚠️ Nenhuma atualização necessária.")
        return False

if __name__ == "__main__":
    print("🔄 Iniciando atualização de thumbnails no banco de dados...")
    update_thumbnails()
    print("✨ Processo concluído!") 