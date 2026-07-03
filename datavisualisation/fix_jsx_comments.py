import re
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
