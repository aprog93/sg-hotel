"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservaPiscina = exports.pagarReservaPiscina = exports.getReservaPiscinaById = exports.getAllReservaPiscina = exports.deleteReservaPiscina = exports.createReservaPiscina = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// models/reservaPiscina.model.js

// Obtener todas las reservas de piscina
const getAllReservaPiscina = async () => {
  const [results] = await _mysql.pool.query(`
    SELECT 
      rp.reserva_piscina_id, 
      rp.cliente_id, 
      c.nombre_apellidos AS cliente_nombre,
      rp.horario_id, 
      hp.hora_inicio, 
      hp.hora_fin,
      rp.fecha,
      rp.estado,
      rp.creado_en,
      rp.actualizado_en
    FROM reservas_piscina rp
    JOIN clientes c ON rp.cliente_id = c.cliente_id
    JOIN horarios_piscina hp ON rp.horario_id = hp.horario_id
  `);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Obtener una reserva de piscina por id
exports.getAllReservaPiscina = getAllReservaPiscina;
const getReservaPiscinaById = async id => {
  const [rows] = await _mysql.pool.query(`
    SELECT 
      rp.reserva_piscina_id,
      rp.cliente_id,
      c.nombre_apellidos AS cliente_nombre,
      rp.horario_id,
      hp.hora_inicio,
      hp.hora_fin,
      rp.fecha,
      rp.numero_personas,
      rp.total,
      rp.metodo_pago,
      rp.estado,
      rp.creado_en,
      rp.actualizado_en
    FROM reservas_piscina rp
    JOIN clientes c ON rp.cliente_id = c.cliente_id
    JOIN horarios_piscina hp ON rp.horario_id = hp.horario_id
    WHERE rp.reserva_piscina_id = ?
  `, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Crear una reserva de piscina
exports.getReservaPiscinaById = getReservaPiscinaById;
const createReservaPiscina = async reservaData => {
  const [result] = await _mysql.pool.query(`INSERT INTO reservas_piscina SET ?`, [reservaData]);
  return result.insertId;
};

// Actualizar una reserva de piscina
exports.createReservaPiscina = createReservaPiscina;
const updateReservaPiscina = async (id, reservaData) => {
  const [result] = await _mysql.pool.query(`UPDATE reservas_piscina SET ? WHERE reserva_piscina_id = ?`, [reservaData, id]);
  return result.affectedRows > 0;
};

// Eliminar una reserva de piscina
exports.updateReservaPiscina = updateReservaPiscina;
const deleteReservaPiscina = async id => {
  const [result] = await _mysql.pool.query(`DELETE FROM reservas_piscina WHERE reserva_piscina_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Pagar una reserva de piscina
exports.deleteReservaPiscina = deleteReservaPiscina;
const pagarReservaPiscina = async id => {
  const [result] = await _mysql.pool.query(`UPDATE reservas_piscina SET estado = 'finalizada' WHERE reserva_piscina_id = ?`, [id]);
  return result.affectedRows > 0;
};
exports.pagarReservaPiscina = pagarReservaPiscina;