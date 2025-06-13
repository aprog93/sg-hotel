"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalHabitaciones = exports.getReservasPorTipoServicio = exports.getReservasPorHabitacion = exports.getNochesOcupadas = exports.getIngresosServicios = exports.getIngresosPorPeriodo = exports.getIngresosPiscina = exports.getIngresosHabitaciones = void 0;
var _mysql = require("../../config/mysql.js");
// 1. Ingresos por periodo (solo reservas finalizadas)
const getIngresosPorPeriodo = async (fechaInicio, fechaFin) => {
  const [results] = await _mysql.pool.query(`SELECT SUM(total) AS ingresos, COUNT(*) AS reservas
     FROM reserva_habitacion
     WHERE estado IN ('checkout','checkin')
       AND fecha_inicio >= ? AND fecha_fin <= ?`, [fechaInicio, fechaFin]);
  return results[0];
};

// 2. Reservas por tipo de servicio en un periodo
exports.getIngresosPorPeriodo = getIngresosPorPeriodo;
const getReservasPorTipoServicio = async (fechaInicio, fechaFin) => {
  const [results] = await _mysql.pool.query(`
    SELECT ts.nombre AS tipo_servicio, COUNT(rs.reserva_servicio_id) AS cantidad
    FROM reservas_servicios rs
      JOIN servicios s ON rs.servicio_id = s.servicio_id
      JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.tipo_servicio_id
      JOIN reservas r ON rs.reserva_id = r.reserva_id
    WHERE r.fecha_inicio >= ? AND r.fecha_fin <= ?
    GROUP BY ts.nombre
    `, [fechaInicio, fechaFin]);
  return results;
};

// 3. Cantidad de reserva por habitación
exports.getReservasPorTipoServicio = getReservasPorTipoServicio;
const getReservasPorHabitacion = async () => {
  const [results] = await _mysql.pool.query(`
    SELECT h.numero AS habitacion, COUNT(r.reserva_id) AS reservas
    FROM reservas r
      JOIN habitaciones h ON r.habitacion_id = h.habitacion_id
    GROUP BY h.numero
    ORDER BY reservas DESC
    `);
  return results;
};

// Ingresos habitaciones
exports.getReservasPorHabitacion = getReservasPorHabitacion;
const getIngresosHabitaciones = async (fechaInicio, fechaFin) => {
  const [res] = await _mysql.pool.query(`SELECT IFNULL(SUM(total),0) AS total 
     FROM reserva_habitacion
     WHERE estado = 'checkout'
       AND fecha_inicio >= ? AND fecha_fin <= ?`, [fechaInicio, fechaFin]);
  return res[0].total ?? 0;
};

// Ingresos servicios adicionales
exports.getIngresosHabitaciones = getIngresosHabitaciones;
const getIngresosServicios = async (fechaInicio, fechaFin) => {
  const [res] = await _mysql.pool.query(`SELECT IFNULL(SUM(total),0) AS total 
     FROM reservas_servicio
     WHERE estado = 'completada'
       AND fecha >= ? AND fecha <= ?`, [fechaInicio, fechaFin]);
  return res[0].total ?? 0;
};

// Ingresos piscina
exports.getIngresosServicios = getIngresosServicios;
const getIngresosPiscina = async (fechaInicio, fechaFin) => {
  const [res] = await _mysql.pool.query(`SELECT IFNULL(SUM(total),0) AS total 
     FROM reservas_piscina
     WHERE estado = 'finalizada'
       AND fecha >= ? AND fecha <= ?`, [fechaInicio, fechaFin]);
  return res[0].total ?? 0;
};

// Total habitaciones activas
exports.getIngresosPiscina = getIngresosPiscina;
const getTotalHabitaciones = async () => {
  const [res] = await _mysql.pool.query(`SELECT COUNT(*) AS total 
     FROM habitaciones
     WHERE estado != 'mantenimiento'`);
  return res[0].total ?? 0;
};

// Noches ocupadas: suma realista de noches (checkout en periodo)
exports.getTotalHabitaciones = getTotalHabitaciones;
const getNochesOcupadas = async (fechaInicio, fechaFin) => {
  const [res] = await _mysql.pool.query(`SELECT IFNULL(SUM(DATEDIFF(fecha_fin, fecha_inicio)),0) AS noches
     FROM reserva_habitacion
     WHERE estado = 'checkout'
       AND fecha_inicio >= ? AND fecha_fin <= ?`, [fechaInicio, fechaFin]);
  return res[0].noches ?? 0;
};
exports.getNochesOcupadas = getNochesOcupadas;