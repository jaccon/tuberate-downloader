# Tuberate Downloader

A sleek, modern YouTube video and playlist downloader built with Electron and `yt-dlp`.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/framework-Electron-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- **Single Video Downloads:** Support for various resolutions and formats.
- **Playlist Support:** View all videos in a playlist and easily navigate to individual links.
- **Audio Extraction:** High-quality MP3 extraction from videos.
- **Progress Tracking:** Real-time progress bar and status updates.
- **Custom Output:** Select your preferred download directory.
- **Modern UI:** Dark-themed, responsive interface with a clean aesthetic.

## Tech Stack

- **Framework:** Electron
- **Backend:** Node.js
- **Downloader Engine:** [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [ffmpeg](https://ffmpeg.org/) (required by `yt-dlp` for merging video and audio streams)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/youtube-downloader.git
   cd youtube-downloader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Download yt-dlp:**
   Ensure the `yt-dlp` binary is present in the `bin/` directory. You can use the provided script (if applicable):
   ```bash
   chmod +x bin/download-yt-dlp.sh
   ./bin/download-yt-dlp.sh
   ```

## Usage

### Development Mode
To run the application in development mode:
```bash
npm start
```

### Building for Production
To package the application for your current OS:
```bash
npm run dist
```
Or for specific platforms:
```bash
npm run dist:mac
npm run dist:win
npm run dist:linux
```

## Project Structure

- `main.js`: Main Electron process, handles IPC and `yt-dlp` execution.
- `preload.js`: Bridge between main and renderer processes.
- `renderer/`: Frontend files (HTML, CSS, JS).
- `bin/`: Contains the `yt-dlp` binary and helper scripts.
- `ai/`: Documentation and context for AI agents.

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Created by [Tuberate](https://github.com/Tuberate).
