const { app, BrowserWindow, electron, ipcMain, ipcRenderer } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false,
    transparent: true,
    fullscreen: true,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('login.html')
  win.setAlwaysOnTop(true, "screen-saver")
  
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('1', (event, args) => {
  //do something with args
  app.exit(0)
  console.log("1")
 });