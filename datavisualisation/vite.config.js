import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom middleware to serve static files from root folders during development
const serveStaticFromRoot = () => ({
  name: 'serve-static-from-root',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
      
      // List of root folders and files we want to serve as static assets
      const allowedPaths = ['/logos/', '/image/', '/svg/', '/csv/', '/logos.json', '/data.json', '/films.js', '/covers.js', '/app.js', '/minimal.otf'];
      
      const shouldServe = allowedPaths.some(p => 
        decodedUrl === p || decodedUrl.startsWith(p)
      );
      
      if (shouldServe) {
        const filePath = path.join(process.cwd(), decodedUrl);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.json': 'application/json',
            '.csv': 'text/csv',
            '.otf': 'font/otf',
            '.js': 'application/javascript'
          };
          if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
          }
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serveStaticFromRoot()],
})
