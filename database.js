const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "user1_abd",
  password: "password1",
  database: "My_reservacion",
});


  async function login(id, password) {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM empleados WHERE id_empleado = ? AND contraseña = ?",
        [id, password]
      );

      if (rows.length > 0) {
        return { success: true, user: rows[0] };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error("Error de base de datos:", err);
      return { success: false, message: "Error en base de datos" };
    }
  }

  async function getNacionalidad(id) {
    const [rows] = await connection.query('SELECT * FROM nacionalidad WHERE id_Nacionalidad = ?', [id]);
    return rows[0];
  }
  
  async function getAllNacionalidades() {
    const [rows] = await connection.query('SELECT * FROM nacionalidad');
    return rows;
  }
  
  async function saveNacionalidad(id, nombre) {
    const existing = await getNacionalidad(id);
    if (existing) {
      await connection.query('UPDATE nacionalidad SET Nombre = ? WHERE id_Nacionalidad = ?', [nombre, id]);
      return;
    }
  
    await connection.query('INSERT INTO nacionalidad (id_Nacionalidad, Nombre) VALUES (?, ?)', [id, nombre]);
  }
  
  async function deleteNacionalidad(id) {
    const [childRows] = await connection.query('SELECT * FROM pasajero WHERE id_Nacionalidad = ?', [id]);
    if (childRows.length > 0) {
      throw new Error('No se puede eliminar: tiene registros hijos');
    }
  
    await connection.query('DELETE FROM nacionalidad WHERE id_Nacionalidad = ?', [id]);
  }

  module.exports = { login, getNacionalidad, getAllNacionalidades, saveNacionalidad, deleteNacionalidad };
