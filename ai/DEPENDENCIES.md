# External Dependencies

Tuberate Downloader depends on external binaries and specific libraries to function correctly.

## 1. Core Binaries

### yt-dlp
- **Purpose:** Analyzing and downloading media from YouTube and other sites.
- **Location:** `bin/yt-dlp` (Development) or `Resources/bin/yt-dlp` (Packaged).
- **Update Strategy:** Currently manual. A script `bin/download-yt-dlp.sh` is provided for initial setup.
- **Usage in Code:** Wrapped in `child_process.spawn` or `execFileSync` in `main.js`.

### ffmpeg (System Requirement)
- **Purpose:** Merging separate video and audio streams (common for high-resolution YouTube downloads).
- **Requirement:** Must be installed on the user's system and available in the `PATH`.
- **macOS Note:** The app automatically adds Homebrew paths (`/usr/local/bin`, `/opt/homebrew/bin`) to `process.env.PATH` when packaged to ensure `ffmpeg` is found.

## 2. Node.js Dependencies

### Electron
- Used for creating the cross-platform desktop shell.

### electron-builder
- Used for packaging and creating installers for macOS, Windows, and Linux.

## 3. System Permissions
- **Filesystem:** The app requires read/write access to the user-selected download directory.
- **Network:** Requires internet access to communicate with YouTube/Google servers.
