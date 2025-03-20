const { app, BrowserWindow, ipcMain  } = require('electron')
const path = require('node:path')



const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Habilita `require` en el renderer
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
  ipcMain.handle("login", async (event, { id, password }) => {
    try {
      const result = await require("./database").login(id, password);

      if (result.success) {
        return result;
      } else {
        return { success: false, message: "ID o contraseña incorrectos" };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error en el servidor" };
    }
  });

  createWindow()

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })




