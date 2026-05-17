# AI Agent Documentation Index

This directory contains specialized documentation designed to help AI agents understand, maintain, and extend the Tuberate Downloader codebase.

## Documentation Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: High-level overview of the system design and process communication.
- **[IPC_INTERFACES.md](./IPC_INTERFACES.md)**: Detailed specification of Inter-Process Communication (IPC) channels.
- **[DEPENDENCIES.md](./DEPENDENCIES.md)**: Information about external binaries and core libraries used.
- **[DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)**: Instructions on how to set up, test, and build the project.

## Project Context

- **Core Technology:** Electron (Chromium + Node.js)
- **Primary Tool:** `yt-dlp` for media analysis and downloading.
- **UI Paradigm:** Single Page Application (SPA) using vanilla JS and CSS in the renderer process.
- **State Management:** Localized state in `renderer/app.js` and asynchronous IPC calls.
