"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.obtenerIngresosPorPeriodo = void 0;
var _mysql = require("../../config/mysql.js");
// ingresos.model.js

/**
 * Consulta los ingresos agrupados por periodo (día, mes, año).
 * @param {Object} params
 * @param {string} params.groupBy - "dia" | "mes" | "anio"
 * @param {string} [params.desde] - Fecha inicio (YYYY-MM-DD)
 * @param {string} [params.hasta] - Fecha fin (YYYY-MM-DD)
 * @returns {Promise<Array>} - [{ periodo: "2024-05", totalIngresos: 12345 }]
 */
const obtenerIngresosPorPeriodo = async ({
  groupBy,
  desde,
  hasta
}) => {
  let dateFormat;
  switch (groupBy) {
    case "dia":
      dateFormat = "%Y-%m-%d";
      break;
    case "anio":
      dateFormat = "%Y";
      break;
    case "mes":
    default:
      dateFormat = "%Y-%m";
      break;
  }
  const params = [dateFormat];
  let where = "WHERE estado IN ('checkout','checkin') AND total IS NOT NULL";
  if (desde) {
    where += " AND fecha_fin >= ?";
    params.push(desde);
  }
  if (hasta) {
    where += " AND fecha_inicio <= ?";
    params.push(hasta);
  }
  const [rows] = await _mysql.pool.query(`
      SELECT DATE_FORMAT(fecha_fin, ?) AS periodo, SUM(total) as totalIngresos
      FROM reserva_habitacion
      ${where}
      GROUP BY periodo
      ORDER BY periodo
    `, params);
  return rows;
};
exports.obtenerIngresosPorPeriodo = obtenerIngresosPorPeriodo;