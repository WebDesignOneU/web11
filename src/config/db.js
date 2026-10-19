// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '-04:00',
  // Devuelve DATE/DATETIME como texto ('YYYY-MM-DD[ HH:mm:ss]'), evitando que
  // mysql2 serialice las fechas a UTC (ej: una función de las 19:30 se
  // respondería como 23:30Z). Así el API respeta el valor almacenado.
  dateStrings: true
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[DB] Conexión exitosa a "${process.env.DB_NAME}" en ${process.env.DB_HOST}`);
    connection.release();
  } catch (error) {
    console.error('[DB] Error al conectar a MySQL:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
