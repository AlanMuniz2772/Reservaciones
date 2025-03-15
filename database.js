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

function login(id, password, callback) {
    const query = `SELECT * FROM empleados WHERE id_empleado = ? AND contraseña = ?`;
    db.query(query, [id, password], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  }

module.exports = { login };