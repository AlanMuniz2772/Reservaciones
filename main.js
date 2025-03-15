const { app, BrowserWindow, ipcMain  } = require('electron')
const db = require('./database');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true, // Habilita `require` en el renderer
      contextIsolation: false
    },
  })

  win.loadFile('index.html')

  ipcMain.on("navigate", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


  // Manejo del login
ipcMain.on('login', (event, { id_empleado, password }) => {
  db.login(id_empleado, password, (err, results) => {
    if (err) {
      event.reply('loginResponse', { success: false});

    } else if (results) { 
      event.reply('loginResponse', { success: true, userSession: results });

    } else {
      event.reply('loginResponse', { success: false});
    }
  });
});

