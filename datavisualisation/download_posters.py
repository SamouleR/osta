import urllib.request
import urllib.parse
import json
import re
import os
import time

covers_content = open('covers.js', 'r', encoding='utf-8').read()

# Make sure image directory exists
os.makedirs('image', exist_ok=True)

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity/1.0')]
urllib.request.install_opener(opener)

# Read films.js to get all titles
films_content = open('films.js', 'r', encoding='utf-8').read()
titles = []
for line in films_content.split('\n')[1:]:
    if not line.strip(): continue
    parts = line.split(',')
    if len(parts) > 1:
        titles.append(parts[1])

new_covers = {}

def get_wiki_image(title):
    try:
        # Search for the film page on French Wikipedia
        search_query = urllib.parse.quote(title + " film")
        search_url = f"https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch={search_query}&utf8=&format=json"
        resp = urllib.request.urlopen(search_url).read()
        search_data = json.loads(resp)
        if not search_data['query']['search']: return None
        
        page_title = search_data['query']['search'][0]['title']
        
        # Get page info including main image
        info_query = urllib.parse.quote(page_title)
        info_url = f"https://fr.wikipedia.org/w/api.php?action=query&titles={info_query}&prop=pageimages&format=json&pithumbsize=500"
        resp = urllib.request.urlopen(info_url).read()
        info_data = json.loads(resp)
        
        pages = info_data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                return pages[page_id]['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching wiki info for {title}: {e}")
    return None

def download_image(url, title):
    try:
        # Create a safe filename
        safe_title = "".join([c if c.isalnum() else "_" for c in title])
        ext = url.split('.')[-1].split('?')[0]
        if ext.lower() not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
            ext = 'jpg'
        filename = f"{safe_title}.{ext}"
        filepath = os.path.join('image', filename)
        
        if not os.path.exists(filepath):
            print(f"Downloading {title} from {url}...")
            urllib.request.urlretrieve(url, filepath)
            time.sleep(0.5) # rate limit friendly
        return f"image/{filename}"
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

# Parse existing covers
pattern = re.compile(r'"([^"]+)":\s*"([^"]+)"')
existing_covers = dict(pattern.findall(covers_content))

for title in titles:
    current_val = existing_covers.get(title)
    
    if current_val and current_val.startswith('image/') and os.path.exists(current_val):
        new_covers[title] = current_val
        continue
        
    if current_val and 'upload.wikimedia.org' in current_val:
        local_path = download_image(current_val, title)
        if local_path:
            new_covers[title] = local_path
            continue
            
    # Need to fetch from wikipedia
    print(f"Searching Wikipedia for: {title}")
    wiki_url = get_wiki_image(title)
    if wiki_url:
        local_path = download_image(wiki_url, title)
        if local_path:
            new_covers[title] = local_path
        else:
            new_covers[title] = current_val or ""
    else:
        new_covers[title] = current_val or ""

# Generate new covers.js content
out_lines = ["const fallbackCovers = {"]
for title, path in new_covers.items():
    if path:
        out_lines.append(f'    "{title}": "{path}",')
out_lines.append("};")

with open('covers.js', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))

print("Successfully updated covers.js and downloaded images.")
