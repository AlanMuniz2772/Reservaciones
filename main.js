const { app, BrowserWindow } = require('electron')
const mysql = require('mysql2');

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
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
