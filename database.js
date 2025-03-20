const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "user1_abd",
  password: "password1",
  database: "My_reservacion",
});

module.exports = {
  login: async (id, password) => {
    try {
      const [rows] = await pool.query(
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
  },
};
