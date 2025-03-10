const { app, BrowserWindow, ipcMain  } = require('electron')
const mysql = require('mysql2');

let userSession = {}; 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'user1_abd', // Cambia esto según tu usuario de MySQL
  password: 'password1', // Si tienes contraseña, agrégala aquí
  database: 'My_reservacion'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Habilita `require` en el renderer
      contextIsolation: false
    },
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


  // Manejo del login
ipcMain.on('login', (event, { username, password }) => {
  const query = `SELECT id_empleado FROM empleados WHERE usuario = ? AND contraseña = ?`;
  db.query(query, [username, password], (err, results) => {
    if (err) {
      event.reply('loginResponse', { success: false, message: 'Error en la base de datos' });
    } else if (results.length > 0) {
      userSession.id = results[0].id_empleado; // Guardar el ID globalmente
      event.reply('loginResponse', { success: true, userId: userSession.id });
    } else {
      event.reply('loginResponse', { success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});