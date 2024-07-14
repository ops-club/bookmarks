import os
import requests
from PIL import Image
from io import BytesIO
import yaml
import shutil
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader

# Fonction pour récupérer le titre de la page à partir de l'URL si le titre est vide
def get_page_title(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # return soup.title.string.strip() if soup.title else ''
            title = soup.title.string.strip() if soup.title else ''
            # Tronquer le titre à 30 caractères
            return title[:35] if len(title) > 35 else title
    except Exception as e:
        print(f"Failed to get title for {url}: {e}")
    return ''

def download_favicon(url, output_dir, favicon_output_dir):
    favicon_url = f"https://www.google.com/s2/favicons?domain={url}&sz=128"
    # print(f"favicon_url::{favicon_url}")
    response = requests.get(favicon_url)
    if response.status_code == 200:
        favicon = Image.open(BytesIO(response.content))
        # favicon = favicon.resize((128, 128))
        # favicon = favicon.resize((128, 128), Image.LANCZOS)
        favicon_path = os.path.join(favicon_output_dir, f"{url.replace('https://', '').replace('http://', '').replace('/', '_')}.ico")
        favicon.save(favicon_path)
        return favicon_path.replace(f"{output_dir}/", '')
    return None

def copy_assets_to_output():
    # Chemins des fichiers sources et destination
    src_css = 'src/styles.css'
    src_js = 'src/script.js'
    dst_folder = 'output/'

    # Assurez-vous que le dossier de sortie existe
    if not os.path.exists(dst_folder):
        os.makedirs(dst_folder)

    # Copie des fichiers CSS et JS vers le dossier de sortie
    shutil.copy(src_css, dst_folder)
    shutil.copy(src_js, dst_folder)

def get_unique_tags(bookmarks):
    # Extraire les tags uniques
    unique_tags = set()
    # for account in data['accounts']:
    for bookmark in bookmarks:
        unique_tags.update(bookmark.get('tags', []))
    unique_tags = sorted(unique_tags)
    return unique_tags

def generate_html_from_yaml(yaml_file):
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)

    accounts = data['accounts']

    env = Environment(loader=FileSystemLoader('src/tpl'))
    template = env.get_template('template.html')

    output_dir = 'output'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Create a folder for favicons
    favicon_dir = os.path.join(output_dir, 'favicons')
    if not os.path.exists(favicon_dir):
        os.makedirs(favicon_dir)

    for account in accounts:
        account_name = list(account.keys())[0]
        account_data = account[account_name]
        # bookmarks = account_data['bookmarks']
        bookmarks = account_data.get('bookmarks', [])
        compiled_bookmarks = []
        sorted_bookmarks = sorted(bookmarks, key=lambda x: x.get('folder', ''))
        # print(f"sorted_bookmarks::{sorted_bookmarks}")
        # Download favicons and add paths to bookmarks
        for bm in sorted_bookmarks:
            url = bm['url']
            title = bm.get('title', None)
            if not title:
                title = get_page_title(url)
                bm['title'] = title
            bm['favicon_url'] = download_favicon(bm['url'],output_dir, favicon_dir)
            compiled_bookmarks.append(bm)
        # print(f"compiled_bookmarks::{compiled_bookmarks}")
        # pinned_bookmarks = [bm for bm in bookmarks if bm.get('pin', False)]
        # grouped_bookmarks = {}
        # for bm in bookmarks:
        #     folder = bm.get('folder', 'Uncategorized')
        #     if folder not in grouped_bookmarks:
        #         grouped_bookmarks[folder] = []
        #     grouped_bookmarks[folder].append(bm)

        # print(f"\n\ncompiled_bookmarks::{compiled_bookmarks} \n\n")
        # tags = sorted({tag for bm in bookmarks for tag in bm.get('tags', [])})
        unique_tags    = get_unique_tags(sorted_bookmarks)
        # unique_tags = sorted({tag for bm in bookmarks for tag in bm.get('tags', [])})
        output_html = template.render(
            account_name=account_name,
            bookmarks=compiled_bookmarks,
            # pinned_bookmarks=pinned_bookmarks,
            # grouped_bookmarks=grouped_bookmarks,
            tags=unique_tags
        )

        with open(os.path.join(output_dir, f"{account_name}.html"), 'w') as output_file:
            output_file.write(output_html)

    # Copy CSS and JS files to output directory
    copy_assets_to_output()

generate_html_from_yaml('bookmarks.yaml')
