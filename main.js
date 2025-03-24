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
  // Manejo del login (llama a la base de datos)
  ipcMain.handle("login", async (event, id, password ) => await db.login(id, password));
  ipcMain.handle('getNacionalidad', async (event, id) => await db.getNacionalidad(id));
  ipcMain.handle('getAllNacionalidades', async () => await db.getAllNacionalidades());
  ipcMain.handle('saveNacionalidad', async (event, id, nombre) => await db.saveNacionalidad(id, nombre));
  ipcMain.handle('deleteNacionalidad', async (event, id) => await db.deleteNacionalidad(id));

  createWindow()

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })




