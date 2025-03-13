#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Script para processar apenas as thumbnails da pasta temp_download
# Como usar: python process_thumbnails.py

import os
import json
import shutil
import glob
from datetime import datetime
import re

# Diretórios
TEMP_DIR = "temp_download"
OUTPUT_THUMBNAILS_DIR = "assets/thumbnails"
OUTPUT_JS_FILE = "assets/js/musicdata.js"

# Criar diretório de thumbnails se não existir
os.makedirs(OUTPUT_THUMBNAILS_DIR, exist_ok=True)

def clean_filename(filename):
    """Remove caracteres inválidos de nomes de arquivo"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename.strip()

def process_webp_files():
    """Processa todos os arquivos .webp na pasta temp_download"""
    # Obter lista de arquivos webp
    webp_files = glob.glob(os.path.join(TEMP_DIR, "*.webp"))
    print(f"Encontrados {len(webp_files)} arquivos webp para processar.")
    
    thumbnails_processadas = []
    
    # Processar cada webp
    for i, webp_file in enumerate(webp_files, 1):
        try:
            # Obter nome base (sem extensão)
            base_name = os.path.splitext(os.path.basename(webp_file))[0]
            print(f"Processando ({i}/{len(webp_files)}): {base_name}")
            
            # Verificar se existe arquivo JSON correspondente
            json_file = os.path.join(TEMP_DIR, base_name + ".info.json")
            if os.path.exists(json_file):
                # Carregar dados do JSON para extrair informações
                with open(json_file, 'r', encoding='utf-8') as f:
                    info = json.load(f)
                
                # Extrair informações
                title = info.get('title', base_name)
                uploader = info.get('uploader', '')
                artist = info.get('artist', uploader)
                
                # Se não tiver artista, tentar extrair do título
                if not artist and ' - ' in title:
                    parts = title.split(' - ', 1)
                    artist = parts[0].strip()
                    title = parts[1].strip()
                
                # Nomes de arquivo limpos
                clean_title = clean_filename(title)
                clean_artist = clean_filename(artist)
                
                # Novo nome para o arquivo
                new_filename = f"{clean_artist} - {clean_title}".strip()
                if new_filename.startswith(" - "):
                    new_filename = new_filename[3:]
                if new_filename.endswith(" - "):
                    new_filename = new_filename[:-3]
                
                new_filename = clean_filename(new_filename)
                if not new_filename:
                    new_filename = clean_filename(base_name)
            else:
                # Se não tiver JSON, usar nome base
                new_filename = clean_filename(base_name)
            
            # Copiar arquivo para a pasta de destino (convertendo para jpg)
            thumbnail_filename = f"{new_filename}.jpg"
            thumbnail_path = os.path.join(OUTPUT_THUMBNAILS_DIR, thumbnail_filename)
            shutil.copy2(webp_file, thumbnail_path)
            
            print(f"✓ Copiada thumbnail: {thumbnail_filename}")
            
            # Adicionar entrada para atualizar o banco de dados depois
            thumbnails_processadas.append({
                "base_name": base_name,
                "new_name": new_filename,
                "thumbnail_path": thumbnail_path
            })
            
        except Exception as e:
            print(f"❌ Erro ao processar {webp_file}: {str(e)}")
    
    return thumbnails_processadas

def update_musicdata_js(thumbnails_processadas):
    """Atualiza o arquivo musicdata.js com as thumbnails processadas"""
    if not os.path.exists(OUTPUT_JS_FILE):
        print(f"Arquivo {OUTPUT_JS_FILE} não encontrado. Não é possível atualizar.")
        return False
    
    # Ler o arquivo atual
    with open(OUTPUT_JS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Criar mapeamento de nomes de arquivos base para novos caminhos de thumbnail
    thumbnail_map = {}
    for thumb in thumbnails_processadas:
        thumbnail_map[thumb["base_name"]] = f"assets/thumbnails/{thumb['new_name']}.jpg"
    
    # Atualizar conteúdo
    modified_content = content
    changed = 0
    
    # Para cada thumbnail processada, procurar no arquivo JS e atualizar
    for base_name, thumb_path in thumbnail_map.items():
        pattern = f'"title": "{re.escape(base_name)}"'
        if pattern in modified_content:
            # Encontrar a entrada e atualizar o caminho da thumbnail
            entry_start = modified_content.find(pattern)
            thumbnail_pattern = '"thumbnail": "assets/thumbnails/default.jpg"'
            entry_end = modified_content.find("}", entry_start)
            
            entry_chunk = modified_content[entry_start:entry_end]
            if "default.jpg" in entry_chunk:
                new_entry_chunk = entry_chunk.replace(
                    '"thumbnail": "assets/thumbnails/default.jpg"', 
                    f'"thumbnail": "{thumb_path}"'
                )
                modified_content = modified_content.replace(entry_chunk, new_entry_chunk)
                changed += 1
    
    # Salvar as alterações
    if changed > 0:
        with open(OUTPUT_JS_FILE, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        print(f"✅ Atualizadas {changed} entradas no banco de dados com novas thumbnails.")
        return True
    else:
        print("⚠️ Nenhuma entrada foi atualizada no banco de dados.")
        return False

def main():
    print("🖼️ Iniciando processamento de thumbnails...")
    thumbnails_processadas = process_webp_files()
    
    if thumbnails_processadas:
        print(f"\n✅ Total de thumbnails processadas: {len(thumbnails_processadas)}")
        update_musicdata_js(thumbnails_processadas)
        print("\n✨ Processamento de thumbnails concluído! ✨")
    else:
        print("\n❌ Nenhuma thumbnail foi processada.")

if __name__ == "__main__":
    main() 