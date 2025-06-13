"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTicketsByCliente = exports.getTickets = exports.getTicketById = exports.getMensajesByTicket = exports.crearTicket = exports.agregarMensaje = void 0;
var _mysql = require("../../config/mysql.js");
const crearTicket = async ticketData => {
  const [result] = await _mysql.pool.query("INSERT INTO tickets_atencion SET ?", [ticketData]);
  return result.insertId;
};
exports.crearTicket = crearTicket;
const getTicketsByCliente = async cliente_id => {
  const [rows] = await _mysql.pool.query(`
        SELECT t.*, c.nombre_apellidos, c.dni, c.telefono, c.email
        FROM tickets_atencion t
        JOIN clientes c ON t.cliente_id = c.cliente_id
        WHERE t.cliente_id = ?
        ORDER BY t.creado_en DESC
    `, [cliente_id]);
  return rows;
};
exports.getTicketsByCliente = getTicketsByCliente;
const getTickets = async () => {
  const [rows] = await _mysql.pool.query(`
        SELECT t.*, c.nombre_apellidos, c.dni, c.telefono, c.email
        FROM tickets_atencion t
        JOIN clientes c ON t.cliente_id = c.cliente_id
        ORDER BY t.creado_en DESC
    `);
  return rows;
};
exports.getTickets = getTickets;
const getTicketById = async ticket_id => {
  const [rows] = await _mysql.pool.query("SELECT * FROM tickets_atencion WHERE ticket_id = ?", [ticket_id]);
  return rows[0];
};
exports.getTicketById = getTicketById;
const agregarMensaje = async mensajeData => {
  const [result] = await _mysql.pool.query("INSERT INTO mensajes_ticket SET ?", [mensajeData]);
  return result.insertId;
};
exports.agregarMensaje = agregarMensaje;
const getMensajesByTicket = async ticket_id => {
  const [rows] = await _mysql.pool.query("SELECT * FROM mensajes_ticket WHERE ticket_id = ? ORDER BY creado_en ASC", [ticket_id]);
  return rows;
};
exports.getMensajesByTicket = getMensajesByTicket;