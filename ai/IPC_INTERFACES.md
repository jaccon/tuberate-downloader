# IPC Interfaces

This document describes the IPC channels used for communication between the Renderer and Main processes.

## Invokable Handlers (Main Process)

These are handled using `ipcMain.handle` and returned as Promises to the renderer.

### `get-video-info`
- **Args:** `url: string`
- **Returns:** `Object` (Single video info or Playlist info)
- **Description:** Fetches metadata using `yt-dlp --dump-json`.

### `get-formats`
- **Args:** `url: string`
- **Returns:** `{ video: Array, audio: Array }`
- **Description:** Lists available formats for a given URL using `yt-dlp -F`.

### `download-video`
- **Args:** `{ url: string, format: string, outputDir: string }`
- **Returns:** `Promise<string>` (Path to the downloaded file)
- **Description:** Starts a download process. Sends progress updates via the `download-progress` event.

### `cancel-download`
- **Args:** None
- **Returns:** `boolean`
- **Description:** Terminates the active `yt-dlp` process.

### `select-folder`
- **Args:** None
- **Returns:** `string | null`
- **Description:** Opens a native directory selection dialog.

### `get-default-downloads`
- **Args:** None
- **Returns:** `string`
- **Description:** Returns the path to the user's default downloads folder.

## Events (Main to Renderer)

### `download-progress`
- **Payload:** `number` (0 to 100)
- **Description:** Emitted during a download to report the current percentage.

## Bridge Exposure (`window.api`)

The following methods are exposed to the renderer in `preload.js`:
- `getVideoInfo(url)`
- `getFormats(url)`
- `downloadVideo(data)`
- `cancelDownload()`
- `selectFolder()`
- `getDefaultDownloads()`
- `onDownloadProgress(callback)`: Registers a listener for progress updates.
