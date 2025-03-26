const { app, BrowserWindow, ipcMain  } = require('electron')
const path = require('node:path')
const db = require('./database');



const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  })

  win.loadFile('index.html')

  ipcMain.on("navigate", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  ipcMain.handle("login", async (event, id, password ) => await db.login(id, password));
  ipcMain.handle('getRow', async (event, parameters, data) => await db.getRow(parameters, data));
  ipcMain.handle('getAll', async (event, parameters) => await db.getAll(parameters));
  ipcMain.handle('deleteRow', async (event, parameters, data) => await db.deleteRow(parameters, data));
  ipcMain.handle('saveNacionalidad', async (event, parameters, data) => await db.saveNacionalidad(parameters, data));

  createWindow()

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })




