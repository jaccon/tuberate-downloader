const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron')
const path = require('path')
const { spawn, execFileSync } = require('child_process')
const fs = require('fs')

let mainWindow
let activeProcess = null

// Fix PATH for macOS packaged app to find ffmpeg installed via Homebrew/etc.
if (process.platform === 'darwin' && app.isPackaged) {
  process.env.PATH = `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin`
}

const YT_DLP = app.isPackaged
  ? path.join(process.resourcesPath, 'bin', 'yt-dlp')
  : path.join(__dirname, 'bin', 'yt-dlp')

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 700,
    minHeight: 500,
    titleBarStyle: 'hidden',
    backgroundColor: '#0f0f0f',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark'
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Utils
function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(1)} ${units[i]}`
}

function parseDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function parseTimestamp(line) {
  const match = line.match(/(\d+\.?\d*)%/);
  if (match) return parseFloat(match[1])
  return null
}

// IPC handlers
ipcMain.handle('get-video-info', async (event, url) => {
  try {
    const output = execFileSync(
      YT_DLP,
      ['--dump-json', '--no-download', '--flat-playlist', url],
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    )

    const lines = output.trim().split('\n')
    const items = lines.map(line => JSON.parse(line))

    if (items.length === 1) {
      const v = items[0]

      let thumbnail = v.thumbnail || ''
      if (v.thumbnails && v.thumbnails.length > 0) {
        const sorted = [...v.thumbnails].sort((a, b) => {
          const resA = (a.height || 0) * (a.width || 0)
          const resB = (b.height || 0) * (b.width || 0)
          return resB - resA
        })
        thumbnail = sorted[0].url || thumbnail
      }

      return {
        type: 'single',
        id: v.id,
        title: v.title,
        duration: v.duration ? parseDuration(v.duration) : 'N/A',
        thumbnail,
        channel: v.channel || v.uploader || 'Unknown',
        channelUrl: v.channel_url || v.uploader_url || '',
        views: v.view_count != null ? v.view_count.toLocaleString() : 'N/A',
        description: v.description || '',
      }
    }

    return {
      type: 'playlist',
      title: items[0].playlist_title || items[0].title || 'Playlist',
      count: items.length,
      items: items.map(v => {
        let thumb = v.thumbnail || ''
        if (v.thumbnails && v.thumbnails.length > 0) {
          const sorted = [...v.thumbnails].sort((a, b) => {
            const resA = (a.height || 0) * (a.width || 0)
            const resB = (b.height || 0) * (b.width || 0)
            return resB - resA
          })
          thumb = sorted[0].url || thumb
        }
        return {
          id: v.id,
          title: v.title,
          duration: v.duration ? parseDuration(v.duration) : 'N/A',
          thumbnail: thumb,
        }
      }),
    }
  } catch (err) {
    throw new Error(`Erro ao obter informações: ${err.message}`)
  }
})

ipcMain.handle('get-formats', async (event, url) => {
  try {
    const output = execFileSync(
      YT_DLP,
      ['-F', '--no-download', url],
      { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024 }
    )

    const lines = output.split('\n')
    const formats = []
    let inFormatList = false

    for (const line of lines) {
      if (/^\[download\]/.test(line)) continue
      if (/^\[info\]/.test(line)) continue
      if (/^\d+/.test(line) && !line.includes('─')) {
        inFormatList = true
        const parts = line.trim().split(/\s{2,}/)
        if (parts.length >= 2) {
          const formatId = parts[0]
          const ext = parts[1] || ''
          const rest = parts.slice(2).join(' ')

          let resolution = ''
          let codec = ''
          let bitrate = ''
          let isAudio = false
          let isVideo = false

          if (/audio\s*only/i.test(rest) || ext === 'm4a' || ext === 'opus' || ext === 'webm' && !/\d{3,4}p/.test(rest)) {
            isAudio = true
            const brMatch = rest.match(/(\d+k)/)
            bitrate = brMatch ? brMatch[1] : ''
          } else if (/video\s*only/i.test(rest)) {
            isVideo = true
            const resMatch = rest.match(/(\d{3,4}p)/)
            resolution = resMatch ? resMatch[1] : ''
          } else {
            const resMatch = rest.match(/(\d{3,4}p)/)
            resolution = resMatch ? resMatch[1] : ''
            if (resolution) isVideo = true
            if (/audio/i.test(rest)) isAudio = true
          }

          formats.push({
            id: formatId,
            ext,
            resolution,
            bitrate,
            codec,
            isAudio,
            isVideo,
            note: rest,
          })
        }
      } else if (inFormatList) {
        break
      }
    }

    const videoFormats = formats.filter(f => f.isVideo && f.resolution)
    const audioFormats = formats.filter(f => f.isAudio)

    videoFormats.sort((a, b) => {
      const ra = parseInt(a.resolution) || 0
      const rb = parseInt(b.resolution) || 0
      return rb - ra
    })

    return { video: videoFormats, audio: audioFormats }
  } catch (err) {
    throw new Error(`Erro ao obter formatos: ${err.message}`)
  }
})

ipcMain.handle('download-video', async (event, { url, format, outputDir }) => {
  if (activeProcess) {
    throw new Error('Já existe um download em andamento')
  }

  const downloadsPath = outputDir || path.join(app.getPath('downloads'), 'YouTube Downloads')
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath, { recursive: true })
  }

  let args = [
    '-o', path.join(downloadsPath, '%(title)s.%(ext)s'),
    '--newline',
    '--progress',
    '--no-playlist',
    '--embed-thumbnail',
    '--write-thumbnail',
    '--convert-thumbnails', 'jpg',
    '--print', 'after_move:filepath',
  ]

  if (format === 'best') {
    args.push('-f', 'bestvideo[height<=1080]+bestaudio/best[height<=1080]')
  } else if (format === 'best-audio') {
    args.push('-f', 'bestaudio', '--extract-audio', '--audio-format', 'mp3')
  } else {
    args.push('-f', `${format}+bestaudio`)
  }

  args.push(url)

  return new Promise((resolve, reject) => {
    const proc = spawn(YT_DLP, args)
    activeProcess = proc

    let fullOutput = ''
    let filePath = ''

    proc.stdout.on('data', (data) => {
      const text = data.toString()
      fullOutput += text

      const progress = parseTimestamp(text)
      if (progress != null) {
        mainWindow?.webContents.send('download-progress', progress)
      }

      const fpMatch = fullOutput.match(/^(.+\.\w+)$/m)
      if (fpMatch) filePath = fpMatch[1]
    })

    proc.stderr.on('data', (data) => {
      fullOutput += data.toString()
    })

    proc.on('close', (code) => {
      activeProcess = null
      if (code === 0) {
        resolve(filePath || path.join(downloadsPath, 'video.mp4'))
      } else {
        reject(new Error(`yt-dlp exit code: ${code}\n${fullOutput}`))
      }
    })

    proc.on('error', (err) => {
      activeProcess = null
      reject(err)
    })
  })
})

ipcMain.handle('cancel-download', async () => {
  if (activeProcess) {
    activeProcess.kill('SIGTERM')
    activeProcess = null
    return true
  }
  return false
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('get-default-downloads', () => {
  return path.join(app.getPath('downloads'), 'YouTube Downloads')
})


