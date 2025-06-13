"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHabitacion = exports.updateEstadoHabitacion = exports.getHabitacionById = exports.getAllHabitaciones = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// Obtener todas las habitaciones
const getAllHabitaciones = async () => {
  const [rows] = await _mysql.pool.query(`SELECT habitacion_id, numero, tipo, descripcion, precio, estado, creado_en, actualizado_en
		FROM habitaciones`);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Obtener una habitación
exports.getAllHabitaciones = getAllHabitaciones;
const getHabitacionById = async id => {
  const [rows] = await _mysql.pool.query(`SELECT habitacion_id, numero, tipo, descripcion, precio, estado, creado_en, actualizado_en
		FROM habitaciones
		WHERE habitacion_id = ?`, [id]);
  return rows[0] ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Actualizar cualquier campo de la habitación
exports.getHabitacionById = getHabitacionById;
const updateHabitacion = async (id, habitacionData) => {
  const [result] = await _mysql.pool.query(`UPDATE habitaciones SET ? WHERE habitacion_id = ?`, [habitacionData, id]);
  return result.affectedRows > 0;
};

// Actualizar solo el estado de la habitación
exports.updateHabitacion = updateHabitacion;
const updateEstadoHabitacion = async (habitacionId, estado) => {
  const [result] = await _mysql.pool.query(`UPDATE habitaciones SET estado = ? WHERE habitacion_id = ?`, [estado, habitacionId]);
  return result.affectedRows > 0;
};
exports.updateEstadoHabitacion = updateEstadoHabitacion;