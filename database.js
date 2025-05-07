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
        return { success: false, message: "Usuario o contraseña incorrectos" };
      }
    } catch (err) {
      console.error("Error de base de datos:", err);
      return { success: false, message: "Error en base de datos" };
    }
  }

  async function getRow(parameters, data) {
    const query = `SELECT * FROM ${parameters.table} WHERE ${parameters.column} = ?`;
    const [rows] = await connection.query(query, [data.id]);
    return rows[0];
  }
  
  
  async function getAll(parameters) {
    const query = `SELECT * FROM ${parameters.table}`;
    const [rows] = await connection.query(query);
    return rows;
  }
  
  async function deleteRow(parameters, data) {
    try {
      const query = `DELETE FROM ${parameters.table} WHERE ${parameters.column} = ?`;
      await connection.query(query, [data.id]);
      return { success: true };
    } catch (err) {
      // Detecta el error por restricción de clave foránea
      if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
        return { success: false, message: "No se puede eliminar porque tiene hijos" };
      }
      console.error("Error al eliminar:", err);
      // Cualquier otro error
      return { success: false, message: "Ocurrió un error inesperado al eliminar." };
    }
  }

  async function saveNacionalidad(parameters, data) {
    const existing = await getRow(parameters, data);
    if (existing) {
      await connection.query('UPDATE nacionalidad SET Nombre = ? WHERE id_Nacionalidad = ?', [data.nombre, data.id]);
      return;
    }
  
    await connection.query('INSERT INTO nacionalidad (id_Nacionalidad, Nombre) VALUES (?, ?)', [data.id, data.nombre]);
  }

  async function saveVuelo(parameters, data) {
    const existing = await getRow(parameters, data);
    if (existing) {
      await connection.query('UPDATE vuelo SET id_Aerolinea = ?,  id_Aeropuerto = ?, Fecha_salida = ?, Fecha_llegada = ?, costo = ? WHERE id_Vuelo = ?;', [data.id_Aerolinea, data.id_Aeropuerto, data.fechaSalida, data.fechaLlegada, data.costo, data.id]);
      return;
    }
  
    await connection.query('INSERT INTO vuelo (id_Vuelo, id_Aerolinea, id_Aeropuerto, Fecha_salida, Fecha_llegada, Costo) VALUES (?, ?, ?, ?, ?, ?)', [data.id, data.id_Aerolinea, data.id_Aeropuerto, data.fechaSalida, data.fechaLlegada, data.costo]);
  }

  module.exports = { login, getRow, getAll, saveNacionalidad, deleteRow, saveVuelo };
