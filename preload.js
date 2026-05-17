const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getVideoInfo: (url) => ipcRenderer.invoke('get-video-info', url),
  getFormats: (url) => ipcRenderer.invoke('get-formats', url),
  downloadVideo: (opts) => ipcRenderer.invoke('download-video', opts),
  cancelDownload: () => ipcRenderer.invoke('cancel-download'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getDefaultDownloads: () => ipcRenderer.invoke('get-default-downloads'),
  onDownloadProgress: (cb) => {
    const handler = (_e, progress) => cb(progress)
    ipcRenderer.on('download-progress', handler)
    return () => ipcRenderer.removeListener('download-progress', handler)
  },
})
