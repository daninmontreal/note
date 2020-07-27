
const { app, BrowserWindow } = require('electron')

function createWindow () {   
  process.env.GOOGLE_API_KEY = 'YOUR_KEY_HERE'
  let win = new BrowserWindow({
    width: 400,
    height: 850,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile('tools/weather/index.html');
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)