import re
import os

html_content = open('index.html', 'r', encoding='utf-8').read()

# Extract body content
body_match = re.search(r'<body>(.*?)<!-- Separated Script Files -->', html_content, re.DOTALL)
if body_match:
    body_html = body_match.group(1).strip()
else:
    body_match = re.search(r'<body>(.*?)<script', html_content, re.DOTALL)
    body_html = body_match.group(1).strip()

# Convert class to className
jsx = body_html.replace('class="', 'className="')

# Close img and br tags properly
jsx = re.sub(r'<img([^>]+)(?<!/)>', r'<img\1 />', jsx)
jsx = jsx.replace('<br>', '<br />')

# Convert inline styles to objects
def style_replacer(match):
    style_str = match.group(1)
    rules = [r.strip() for r in style_str.split(';') if r.strip()]
    obj_props = []
    for rule in rules:
        if ':' not in rule: continue
        key, val = rule.split(':', 1)
        key = key.strip()
        val = val.strip()
        # Convert kebab-case to camelCase
        parts = key.split('-')
        key = parts[0] + "".join(p.capitalize() for p in parts[1:])
        obj_props.append(f"{key}: '{val}'")
    return "style={{" + ", ".join(obj_props) + "}}"

jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)

app_jsx = f"""import React, {{ useEffect }} from 'react'

export default function App() {{
  useEffect(() => {{
    // We dynamically load app.js so it executes AFTER React has rendered the DOM
    const script = document.createElement('script')
    script.src = '/app.js'
    script.async = true
    document.body.appendChild(script)
    
    // Cleanup to prevent multiple scripts in dev
    return () => {{
      document.body.removeChild(script)
    }}
  }}, [])

  return (
    <>
      {jsx}
    </>
  )
}}
"""

os.makedirs('src', exist_ok=True)
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)

main_jsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(main_jsx)

# Modify index.html to serve as Vite entry point
new_index_html = re.sub(
    r'<body>.*?</body>', 
    '''<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script src="/films.js"></script>
    <script src="/covers.js"></script>
</body>''', 
    html_content, 
    flags=re.DOTALL
)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index_html)

print("Migration script completed. src/App.jsx and src/main.jsx generated, index.html updated.")
