"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doCheckout = exports.doCheckin = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// Realizar Check-in: cambia reserva a 'checkin' y habitación a 'ocupada'
const doCheckin = async reservaId => {
  const connection = await (0, _mysql.connectDB)();
  // 1. Actualiza estado de la reserva
  await connection.query(`UPDATE reservas SET estado = 'checkin' WHERE reserva_id = ?`, [reservaId]);
  // 2. Obtiene la habitación relacionada
  const [[reserva]] = await connection.query(`SELECT habitacion_id FROM reservas WHERE reserva_id = ?`, [reservaId]);
  // 3. Cambia estado de la habitación
  if (reserva) {
    await connection.query(`UPDATE habitaciones SET estado = 'ocupada' WHERE habitacion_id = ?`, [reserva.habitacion_id]);
  }
  await connection.end();
  return true;
};

// Realizar Check-out: cambia reserva a 'checkout' y habitación a 'limpieza'
exports.doCheckin = doCheckin;
const doCheckout = async reservaId => {
  const connection = await (0, _mysql.connectDB)();
  // 1. Actualiza estado de la reserva
  await connection.query(`UPDATE reservas SET estado = 'checkout' WHERE reserva_id = ?`, [reservaId]);
  // 2. Obtiene la habitación relacionada
  const [[reserva]] = await connection.query(`SELECT habitacion_id FROM reservas WHERE reserva_id = ?`, [reservaId]);
  // 3. Cambia estado de la habitación
  if (reserva) {
    await connection.query(`UPDATE habitaciones SET estado = 'limpieza' WHERE habitacion_id = ?`, [reserva.habitacion_id]);
  }
  await connection.end();
  return true;
};
exports.doCheckout = doCheckout;