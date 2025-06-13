"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEstadoReserva = exports.getReservasServicio = exports.getReservasByCliente = exports.getReservaById = exports.getAllReservasServicio = exports.createReservaServicio = exports.cancelarReservaServicio = void 0;
var _mysql = require("../../../config/mysql.js");
var _dateFormatter = require("../../../utils/dateFormatter.js");
// models/reservasServicios.model.js

// Crear una reserva de servicio
const createReservaServicio = async reservaData => {
  // Si no tiene hora_fin, calculamos en base al servicio
  if (!reservaData.hora_fin && reservaData.hora_inicio) {
    const [servicioRows] = await _mysql.pool.query(`SELECT duracion_minutos FROM servicios_adicionales WHERE servicio_id = ?`, [reservaData.servicio_id]);
    if (servicioRows.length && servicioRows[0].duracion_minutos) {
      // Calcular hora_fin basada en la duración del servicio
      const horaInicio = new Date(`2000-01-01T${reservaData.hora_inicio}`);
      horaInicio.setMinutes(horaInicio.getMinutes() + servicioRows[0].duracion_minutos);

      // Formatear como string de hora (HH:MM:SS)
      reservaData.hora_fin = horaInicio.toTimeString().split(" ")[0];
    }
  }

  // Si no tiene total, calculamos en base al precio del servicio y número de personas
  if (!reservaData.total) {
    const [servicioRows] = await _mysql.pool.query(`SELECT precio FROM servicios_adicionales WHERE servicio_id = ?`, [reservaData.servicio_id]);
    if (servicioRows.length) {
      const numPersonas = reservaData.numero_personas || 1;
      reservaData.total = servicioRows[0].precio * numPersonas;
    }
  }

  // Insertamos la reserva
  const [result] = await _mysql.pool.query(`INSERT INTO reservas_servicio SET ?`, [reservaData]);
  return result.insertId;
};

// Obtener todas las reservas
exports.createReservaServicio = createReservaServicio;
const getAllReservasServicio = async () => {
  const [rows] = await _mysql.pool.query(`SELECT rs.*, c.nombre_apellidos as cliente_nombre, sa.nombre as servicio_nombre
         FROM reservas_servicio rs
         JOIN clientes c ON rs.cliente_id = c.cliente_id
         JOIN servicios_adicionales sa ON rs.servicio_id = sa.servicio_id
         ORDER BY rs.fecha DESC, rs.hora_inicio ASC`);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Obtener todas las reservas de un servicio
exports.getAllReservasServicio = getAllReservasServicio;
const getReservasServicio = async servicioId => {
  const [rows] = await _mysql.pool.query(`SELECT rs.*, c.nombre_apellidos as cliente_nombre, sa.nombre as servicio_nombre
         FROM reservas_servicio rs
         JOIN clientes c ON rs.cliente_id = c.cliente_id
         JOIN servicios_adicionales sa ON rs.servicio_id = sa.servicio_id
         WHERE rs.servicio_id = ?
         ORDER BY rs.fecha DESC, rs.hora_inicio ASC`, [servicioId]);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Obtener todas las reservas de un cliente
exports.getReservasServicio = getReservasServicio;
const getReservasByCliente = async clienteId => {
  const [rows] = await _mysql.pool.query(`SELECT rs.*, sa.nombre as servicio_nombre, sa.descripcion as servicio_descripcion
         FROM reservas_servicio rs
         JOIN servicios_adicionales sa ON rs.servicio_id = sa.servicio_id
         WHERE rs.cliente_id = ?
         ORDER BY rs.fecha DESC, rs.hora_inicio ASC`, [clienteId]);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Actualizar estado de una reserva
exports.getReservasByCliente = getReservasByCliente;
const updateEstadoReserva = async (reservaId, nuevoEstado) => {
  const estadosValidos = ["pendiente", "confirmada", "completada", "cancelada"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error(`Estado no válido. Debe ser uno de: ${estadosValidos.join(", ")}`);
  }
  const [result] = await _mysql.pool.query(`UPDATE reservas_servicio SET estado = ? WHERE reserva_servicio_id = ?`, [nuevoEstado, reservaId]);
  return result.affectedRows > 0;
};

// Cancelar una reserva
exports.updateEstadoReserva = updateEstadoReserva;
const cancelarReservaServicio = async reservaId => {
  return updateEstadoReserva(reservaId, "cancelada");
};

// Obtener reserva por ID
exports.cancelarReservaServicio = cancelarReservaServicio;
const getReservaById = async reservaId => {
  const [rows] = await _mysql.pool.query(`SELECT rs.*, c.nombre_apellidos as cliente_nombre, 
                c.email as cliente_email, c.telefono as cliente_telefono,
                sa.nombre as servicio_nombre, sa.descripcion as servicio_descripcion
         FROM reservas_servicio rs
         JOIN clientes c ON rs.cliente_id = c.cliente_id
         JOIN servicios_adicionales sa ON rs.servicio_id = sa.servicio_id
         WHERE rs.reserva_servicio_id = ?`, [reservaId]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};
exports.getReservaById = getReservaById;