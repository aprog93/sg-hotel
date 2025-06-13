"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectDB = connectDB;
exports.executeQuery = executeQuery;
exports.pool = void 0;
var _promise = _interopRequireDefault(require("mysql2/promise"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// config/mysql.js

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
console.log("Configuración MySQL:", {
  host: config.host,
  user: config.user,
  database: config.database
});
const pool = exports.pool = _promise.default.createPool(config);
async function executeQuery(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Error ejecutando consulta:", error);
    throw error;
  }
}
async function connectDB() {
  try {
    // Realizar una consulta simple para verificar la conexión
    await pool.execute("SELECT 1");
    console.log("***** CONEXIÓN MySQL CORRECTA *****");
    return true;
  } catch (error) {
    console.error("***** ERROR CONEXIÓN MySQL *****", error);
    return false;
  }
}