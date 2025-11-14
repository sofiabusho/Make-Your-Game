# How to Start Your Game

## Quick Start

1. **Install a local web server** (you need this for ES6 modules):

   ```bash
   # Option 1: Using Python
   python3 -m http.server 8000
   
   # Option 2: Using Node.js (if you have npx)
   npx http-server -p 8000
   
   # Option 3: Using PHP
   php -S localhost:8000
   ```

2. **Open your browser** and go to:
   - Main game: http://localhost:8000/index.html
   - Tilemap test: http://localhost:8000/tilemap_test.html

## Build Commands

### CSS Build (Required before playing)
```bash
npm install          # Install dependencies (first time only)
npm run build:css    # Build CSS for production
```

### Development Mode
```bash
npm run watch:css    # Auto-rebuild CSS on changes
```

## Troubleshooting

### "Module not found" errors
- Make sure you're using a web server (not opening file:// directly)
- ES6 modules require HTTP/HTTPS protocol

### Styles not appearing
- Run `npm run build:css` to rebuild
- Check that `dist/styles.css` exists and is ~25KB

### Game not loading
- Open browser console (F12) to see errors
- Verify all files are present in correct directories
