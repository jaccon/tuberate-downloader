# System Architecture

Tuberate Downloader follows the standard Electron multi-process architecture.

## 1. Main Process (`main.js`)
The "backend" of the application. It has full access to Node.js APIs and is responsible for:
- Managing application lifecycle and windows.
- Spawning and managing `yt-dlp` child processes.
- Handling filesystem operations (creating download directories, checking file existence).
- Providing data to the renderer process via IPC.

## 2. Renderer Process (`renderer/`)
The "frontend" of the application. It runs in a Chromium sandbox and is responsible for:
- Rendering the User Interface (`index.html`, `style.css`).
- Handling user interactions (clicks, input).
- Requesting data and actions from the main process through the `api` bridge.

## 3. Preload Script (`preload.js`)
The "bridge" between the two processes. It uses `contextBridge` to securely expose a limited subset of IPC functionality to the renderer process under the `window.api` object.

## 4. Communication Flow
1. User enters a URL and clicks "Analyze".
2. Renderer calls `window.api.getVideoInfo(url)`.
3. Preload sends an `ipcRenderer.invoke('get-video-info', url)` message.
4. Main process receives the request, executes `yt-dlp --dump-json`, parses the output, and returns a JSON object.
5. Renderer receives the object and updates the DOM.

## 5. Media Engine
The application relies on `yt-dlp` as its primary engine. It is bundled as an external resource and located in the `bin/` directory. For production builds, it is moved to the application's resource path.
