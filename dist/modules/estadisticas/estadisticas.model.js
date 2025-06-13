"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usoPiscinaPorHorario = exports.ticketsPorEstado = exports.reservasPorEstado = exports.nuevosClientes = exports.ingresosHabitaciones = exports.habitacionesOcupacion = void 0;
var _mysql = require("../../config/mysql.js");
/** Ocupación actual de habitaciones por estado */
const habitacionesOcupacion = async () => {
  const [rows] = await _mysql.pool.query(`
        SELECT estado, COUNT(*) as cantidad
        FROM habitaciones
        GROUP BY estado
    `);
  return rows;
};

/** Total de ingresos por reservas de habitaciones (finalizadas o checkin) */
exports.habitacionesOcupacion = habitacionesOcupacion;
const ingresosHabitaciones = async ({
  desde,
  hasta
} = {}) => {
  // Puedes filtrar por fechas si se proveen:
  let where = "WHERE estado IN ('checkout','checkin') AND total IS NOT NULL";
  const params = [];
  if (desde) {
    where += " AND fecha_fin >= ?";
    params.push(desde);
  }
  if (hasta) {
    where += " AND fecha_inicio <= ?";
    params.push(hasta);
  }
  const [rows] = await _mysql.pool.query(`
        SELECT SUM(total) as totalIngresos, COUNT(*) as totalReservas
        FROM reserva_habitacion
        ${where}
    `, params);
  return rows;
};

/** Clientes nuevos en un periodo */
exports.ingresosHabitaciones = ingresosHabitaciones;
const nuevosClientes = async ({
  desde,
  hasta
} = {}) => {
  let where = "";
  const params = [];
  if (desde) {
    where += (where ? " AND " : " WHERE ") + "creado_en >= ?";
    params.push(desde);
  }
  if (hasta) {
    where += (where ? " AND " : " WHERE ") + "creado_en <= ?";
    params.push(hasta);
  }
  const [rows] = await _mysql.pool.query(`
        SELECT COUNT(*) as nuevosClientes
        FROM clientes
        ${where}
    `, params);
  return rows;
};

/** Reservas por estado (habitaciones, restaurante, piscina, servicios) */
exports.nuevosClientes = nuevosClientes;
const reservasPorEstado = async tabla => {
  const tablasValidas = ["reserva_habitacion", "reservas_restaurante", "reservas_piscina", "reservas_servicio"];
  if (!tablasValidas.includes(tabla)) throw new Error("Tabla no permitida");
  const [rows] = await _mysql.pool.query(`
        SELECT estado, COUNT(*) as cantidad
        FROM ${tabla}
        GROUP BY estado
    `);
  return rows;
};

/** Tickets de atención por estado */
exports.reservasPorEstado = reservasPorEstado;
const ticketsPorEstado = async () => {
  const [rows] = await _mysql.pool.query(`
        SELECT estado, COUNT(*) as cantidad
        FROM tickets_atencion
        GROUP BY estado
    `);
  return rows;
};

/** Uso y aforo de la piscina por horario */
exports.ticketsPorEstado = ticketsPorEstado;
const usoPiscinaPorHorario = async ({
  fecha
} = {}) => {
  const params = [];
  let where = "";
  if (fecha) {
    where = "WHERE r.fecha = ?";
    params.push(fecha);
  }
  const [rows] = await _mysql.pool.query(`
        SELECT h.horario_id, h.hora_inicio, h.hora_fin, h.aforo_maximo,
               h.estado as estadoHorario,
               SUM(CASE WHEN r.estado = 'reservada' THEN r.numero_personas ELSE 0 END) as reservadas,
               SUM(CASE WHEN r.estado = 'finalizada' THEN r.numero_personas ELSE 0 END) as finalizadas
        FROM horarios_piscina h
        LEFT JOIN reservas_piscina r ON h.horario_id = r.horario_id ${where ? "AND" : ""} ${where}
        GROUP BY h.horario_id
    `, params);
  return rows;
};
exports.usoPiscinaPorHorario = usoPiscinaPorHorario;