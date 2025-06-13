"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSalidasHoy = exports.getLlegadasHoy = exports.getHuespedesActuales = exports.getEstadoHabitaciones = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// Llegadas del día (check-in pendientes)
const getLlegadasHoy = async () => {
  const connection = await (0, _mysql.connectDB)();
  const [results] = await connection.query(`
    SELECT r.reserva_id, c.nombre AS cliente_nombre, h.numero AS habitacion_numero,
           r.fecha_inicio, r.estado
    FROM reservas r
    JOIN clientes c ON r.cliente_id = c.cliente_id
    JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
    WHERE r.fecha_inicio = CURDATE() AND r.estado = 'reservada'
    ORDER BY r.fecha_inicio, h.numero
  `);
  await connection.end();
  return results.map(_dateFormatter.formatDatesInObject);
};

// Salidas del día (check-out pendientes)
exports.getLlegadasHoy = getLlegadasHoy;
const getSalidasHoy = async () => {
  const connection = await (0, _mysql.connectDB)();
  const [results] = await connection.query(`
    SELECT r.reserva_id, c.nombre AS cliente_nombre, h.numero AS habitacion_numero,
           r.fecha_fin, r.estado
    FROM reservas r
    JOIN clientes c ON r.cliente_id = c.cliente_id
    JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
    WHERE r.fecha_fin = CURDATE() AND r.estado = 'checkin'
    ORDER BY r.fecha_fin, h.numero
  `);
  await connection.end();
  return results.map(_dateFormatter.formatDatesInObject);
};

// Estado actual de todas las habitaciones
exports.getSalidasHoy = getSalidasHoy;
const getEstadoHabitaciones = async () => {
  const connection = await (0, _mysql.connectDB)();
  const [results] = await connection.query(`
    SELECT habitacion_id, numero, tipo, estado, descripcion, precio
    FROM habitaciones
    ORDER BY tipo, numero
  `);
  await connection.end();
  return results.map(_dateFormatter.formatDatesInObject);
};

// Listado de huéspedes actualmente alojados (en 'checkin')
exports.getEstadoHabitaciones = getEstadoHabitaciones;
const getHuespedesActuales = async () => {
  const connection = await (0, _mysql.connectDB)();
  const [results] = await connection.query(`
    SELECT r.reserva_id, c.nombre AS cliente_nombre, h.numero AS habitacion_numero,
           r.fecha_inicio, r.fecha_fin
    FROM reservas r
    JOIN clientes c ON r.cliente_id = c.cliente_id
    JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
    WHERE r.estado = 'checkin'
    ORDER BY r.fecha_fin
  `);
  await connection.end();
  return results.map(_dateFormatter.formatDatesInObject);
};
exports.getHuespedesActuales = getHuespedesActuales;