"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservacionEstado = exports.updateReservacion = exports.getReservacionById = exports.getAllReservacion = exports.deleteReservacion = exports.createReservacion = exports.cancelarReservacion = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// Obtener todas las reservaciones
const getAllReservacion = async () => {
  const [results] = await _mysql.pool.query(`
		SELECT r.reserva_id, r.cliente_id, c.nombre_apellidos AS cliente_nombre, r.habitacion_id, h.numero AS habitacion_numero, 
		r.fecha_inicio, r.fecha_fin, r.estado, r.total, r.creado_en, r.actualizado_en
		FROM reserva_habitacion r
		JOIN clientes c ON r.cliente_id = c.cliente_id
		JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
	`);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Obtener reservación por ID
exports.getAllReservacion = getAllReservacion;
const getReservacionById = async id => {
  const [rows] = await _mysql.pool.query(`SELECT r.reserva_id, r.cliente_id, c.nombre_apellidos AS cliente_nombre, r.habitacion_id, h.numero AS habitacion_numero, 
			r.fecha_inicio, r.fecha_fin, r.estado, r.total, r.creado_en, r.actualizado_en
		FROM reserva_habitacion r
		JOIN clientes c ON r.cliente_id = c.cliente_id
		JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
		WHERE r.reserva_id = ?`, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Crear una reservación
exports.getReservacionById = getReservacionById;
const createReservacion = async reservaData => {
  const [result] = await _mysql.pool.query(`INSERT INTO reserva_habitacion SET ?`, [reservaData]);
  return result.insertId;
};

// Actualizar estado de una reservación
exports.createReservacion = createReservacion;
const updateReservacionEstado = async (reservaId, estado) => {
  const [result] = await _mysql.pool.query(`UPDATE reserva_habitacion SET estado = ?, actualizado_en = NOW() WHERE reserva_id = ?`, [estado, reservaId]);
  return result.affectedRows > 0;
};

// Actualizar datos de una reservación
exports.updateReservacionEstado = updateReservacionEstado;
const updateReservacion = async (id, reservaData) => {
  const [result] = await _mysql.pool.query(`UPDATE reserva_habitacion SET ? WHERE reserva_id = ?`, [reservaData, id]);
  return result.affectedRows > 0;
};

// Eliminar reservación
exports.updateReservacion = updateReservacion;
const deleteReservacion = async id => {
  const [result] = await _mysql.pool.query(`DELETE FROM reserva_habitacion WHERE reserva_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Cancelar reservación
exports.deleteReservacion = deleteReservacion;
const cancelarReservacion = async reservaId => {
  const [result] = await _mysql.pool.query(`UPDATE reserva_habitacion SET estado = 'cancelada', actualizado_en = NOW() WHERE reserva_id = ?`, [reservaId]);
  return result.affectedRows > 0;
};
exports.cancelarReservacion = cancelarReservacion;