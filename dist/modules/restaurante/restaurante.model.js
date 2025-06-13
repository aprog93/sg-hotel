"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservaRestaurante = exports.getReservasRestauranteByCliente = exports.getReservaRestauranteById = exports.getMesasDisponibles = exports.getAllReservaRestaurante = exports.deleteReservaRestaurante = exports.createReservaRestaurante = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// models/reservaRestaurante.model.js

// Todas las reservas restaurante
const getAllReservaRestaurante = async () => {
  const [results] = await _mysql.pool.query(`
    SELECT rr.reserva_restaurante_id, rr.cliente_id, c.nombre_apellidos AS cliente_nombre,
           rr.mesa_id, m.numero AS mesa_numero, rr.fecha, rr.hora_inicio, rr.hora_fin,
           rr.numero_comensales, rr.estado, rr.creado_en, rr.actualizado_en
    FROM reservas_restaurante rr
    JOIN clientes c ON rr.cliente_id = c.cliente_id
    JOIN mesas_restaurante m ON rr.mesa_id = m.mesa_id
  `);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Por Id
exports.getAllReservaRestaurante = getAllReservaRestaurante;
const getReservaRestauranteById = async id => {
  const [rows] = await _mysql.pool.query(`
    SELECT rr.reserva_restaurante_id, rr.cliente_id, c.nombre_apellidos AS cliente_nombre,
           rr.mesa_id, m.numero AS mesa_numero, rr.fecha, rr.hora_inicio, rr.hora_fin,
           rr.numero_comensales, rr.estado, rr.creado_en, rr.actualizado_en
    FROM reservas_restaurante rr
    JOIN clientes c ON rr.cliente_id = c.cliente_id
    JOIN mesas_restaurante m ON rr.mesa_id = m.mesa_id
    WHERE rr.reserva_restaurante_id = ?
  `, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Crear (incluye chequeo de solape de mesas)
exports.getReservaRestauranteById = getReservaRestauranteById;
const createReservaRestaurante = async reservaData => {
  // Verificar disponibilidad de la mesa en ese horario
  const [overlap] = await _mysql.pool.query(`
    SELECT COUNT(*) AS count FROM reservas_restaurante
    WHERE mesa_id = ? AND fecha = ? AND estado = 'reservada'
      AND (
        (hora_inicio < ? AND hora_fin > ?) OR
        (hora_inicio < ? AND hora_fin > ?) OR
        (hora_inicio >= ? AND hora_fin <= ?)
      )
  `, [reservaData.mesa_id, reservaData.fecha, reservaData.hora_fin, reservaData.hora_inicio, reservaData.hora_inicio, reservaData.hora_fin, reservaData.hora_inicio, reservaData.hora_fin]);
  if (overlap[0].count > 0) {
    throw new Error("La mesa seleccionada ya está reservada en ese horario.");
  }
  const [result] = await _mysql.pool.query(`INSERT INTO reservas_restaurante SET ?`, [reservaData]);
  return result.insertId;
};
exports.createReservaRestaurante = createReservaRestaurante;
const updateReservaRestaurante = async (id, reservaData) => {
  const [result] = await _mysql.pool.query(`UPDATE reservas_restaurante SET ? WHERE reserva_restaurante_id = ?`, [reservaData, id]);
  return result.affectedRows > 0;
};
exports.updateReservaRestaurante = updateReservaRestaurante;
const deleteReservaRestaurante = async id => {
  const [result] = await _mysql.pool.query(`DELETE FROM reservas_restaurante WHERE reserva_restaurante_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Mesas disponibles en rango horario
exports.deleteReservaRestaurante = deleteReservaRestaurante;
const getMesasDisponibles = async (fecha, hora_inicio, hora_fin) => {
  const [mesas] = await _mysql.pool.query(`
    SELECT m.mesa_id, m.numero, m.capacidad
      FROM mesas_restaurante m
    WHERE m.estado = 'disponible'
      AND NOT EXISTS (
        SELECT 1 FROM reservas_restaurante rr
          WHERE rr.mesa_id = m.mesa_id AND rr.fecha = ?
          AND rr.estado = 'reservada'
          AND (
            (rr.hora_inicio < ? AND rr.hora_fin > ?) OR
            (rr.hora_inicio < ? AND rr.hora_fin > ?) OR
            (rr.hora_inicio >= ? AND rr.hora_fin <= ?)
          )
      )
  `, [fecha, hora_fin, hora_inicio, hora_inicio, hora_fin, hora_inicio, hora_fin]);
  return mesas;
};

// Reservas restaurante por cliente
exports.getMesasDisponibles = getMesasDisponibles;
const getReservasRestauranteByCliente = async clienteId => {
  const [reservas] = await _mysql.pool.query(`
    SELECT rr.reserva_restaurante_id, rr.cliente_id, rr.mesa_id,
           m.numero AS mesa_numero, rr.fecha, rr.hora_inicio, rr.hora_fin,
           rr.numero_comensales, rr.estado
    FROM reservas_restaurante rr
    JOIN mesas_restaurante m ON rr.mesa_id = m.mesa_id
    WHERE rr.cliente_id = ?
  `, [clienteId]);
  return reservas.map(_dateFormatter.formatDatesInObject);
};
exports.getReservasRestauranteByCliente = getReservasRestauranteByCliente;