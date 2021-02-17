var { app, BrowserWindow, Menu } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
      width: 600,
      height: 400,
      resizable: true,
      frame:false,
      'minWidth': 490,
      'minHeight': 250,
      webPreferences: {
        nodeIntegration: true
      }
    })
    
    // win.webContents.openDevTools()
    win.setMenu(null)
    win.loadFile('index.html')
  };
  
  app.whenReady().then(createWindow);
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
