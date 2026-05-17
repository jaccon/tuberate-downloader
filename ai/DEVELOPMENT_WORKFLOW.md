# Development Workflow

## Getting Started

1. **Setup:**
   ```bash
   npm install
   ```
2. **Binary Verification:**
   Ensure `bin/yt-dlp` exists. If not, run:
   ```bash
   ./bin/download-yt-dlp.sh
   ```

## Running the App

```bash
npm start
```

## Adding Features

1. **New Backend Logic:** Add to `main.js` and register a new `ipcMain.handle`.
2. **Expose to Renderer:** Update `preload.js` to include the new IPC call in the `api` object.
3. **Frontend Implementation:** Update `renderer/app.js` to call the new API and update `index.html`/`style.css` for UI changes.

## Packaging

The project uses `electron-builder` for distribution.

- **Standard Build:** `npm run pack` (builds to `dist/` without installer).
- **Distributable Build:** `npm run dist` (creates installers).

### Configuration
Build settings are located in the `build` section of `package.json`.
- `appId`: `com.tuberate.downloader`
- `productName`: `Tuberate Downloader`
- `extraResources`: Ensures `bin/yt-dlp` is included in the package.

## Debugging
- **Main Process:** Use `console.log` in `main.js`. View output in the terminal where `npm start` was run.
- **Renderer Process:** Press `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Win/Linux) to open Chrome DevTools.
