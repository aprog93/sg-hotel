"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCliente = exports.getClienteById = exports.getAllClientesWithReservaActiva = exports.getAllClientes = exports.deleteCliente = exports.createCliente = exports.buscarClientes = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
/**
 * Ejecuta una consulta SQL utilizando el pool de conexiones y maneja errores
 * @param {Function} queryFn - Función que recibe el pool y ejecuta la consulta
 * @returns {Promise<*>} - Resultado de la consulta
 */
async function executePoolQuery(queryFn) {
  try {
    return await queryFn(_mysql.pool);
  } catch (error) {
    console.error("Database query error:", error.message);
    throw error; // Re-throw para manejo en capa superior
  }
}

/**
 * Obtiene todos los clientes de la base de datos
 * @returns {Promise<Array>} Lista de clientes formateada
 */
const getAllClientes = async () => executePoolQuery(async pool => {
  const [results] = await pool.query(`
      SELECT cliente_id, nombre_apellidos, dni, email, telefono, direccion, creado_en, actualizado_en
      FROM clientes
    `);
  // await pool.end();
  return Array.isArray(results) ? results.map(_dateFormatter.formatDatesInObject) : [];
});

/**
 * Busca clientes por nombre, habitación o teléfono (consulta parcial y segura)
 * @param {string} termino - Texto a buscar
 * @returns {Promise<Array>} - Clientes coincidentes, máximo 10 resultados
 */
exports.getAllClientes = getAllClientes;
const buscarClientes = async termino => executePoolQuery(async pool => {
  const q = `%${termino}%`;
  const [results] = await pool.query(`SELECT cliente_id, nombre_apellidos, dni, telefono
			 FROM clientes
			 WHERE nombre_apellidos LIKE ? OR dni LIKE ? OR telefono LIKE ?
			 ORDER BY nombre_apellidos
			 LIMIT 10`, [q, q, q]);
  return Array.isArray(results) ? results.map(_dateFormatter.formatDatesInObject) : [];
});

/**
 * Obtiene un cliente por su ID
 * @param {number} id - ID del cliente
 * @returns {Promise<Object|null>} Datos del cliente o null si no existe
 */
exports.buscarClientes = buscarClientes;
const getClienteById = async id => executePoolQuery(async pool => {
  const [rows] = await pool.query(`SELECT cliente_id, nombre_apellidos, dni, email, telefono, direccion, creado_en, actualizado_en
       FROM clientes WHERE cliente_id = ?`, [id]);
  // await pool.end();
  return rows.length > 0 ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
});

/**
 * Crea un nuevo cliente en la base de datos
 * @param {Object} clienteData - Datos del cliente a crear
 * @returns {Promise<number>} ID del cliente creado
 */
exports.getClienteById = getClienteById;
const createCliente = async clienteData => executePoolQuery(async pool => {
  const [result] = await pool.query(`INSERT INTO clientes SET ?`, [clienteData]);
  // await pool.end();
  return result.insertId;
});

/**
 * Actualiza los datos de un cliente existente
 * @param {number} id - ID del cliente a actualizar
 * @param {Object} clienteData - Nuevos datos del cliente
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
exports.createCliente = createCliente;
const updateCliente = async (id, clienteData) => executePoolQuery(async pool => {
  const [result] = await pool.query(`UPDATE clientes SET ? WHERE cliente_id = ?`, [clienteData, id]);
  // await pool.end();
  return result.affectedRows > 0;
});

/**
 * Elimina un cliente de la base de datos
 * @param {number} id - ID del cliente a eliminar
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
exports.updateCliente = updateCliente;
const deleteCliente = async id => executePoolQuery(async pool => {
  const [result] = await pool.query(`DELETE FROM clientes WHERE cliente_id = ?`, [id]);
  // await pool.end();
  return result.affectedRows > 0;
});

/**
 * Obtiene todos los clientes con información sobre si tienen reservas activas
 * @returns {Promise<Array>} Lista de clientes con flag de reserva activa
 */
exports.deleteCliente = deleteCliente;
const getAllClientesWithReservaActiva = async () => executePoolQuery(async pool => {
  const [clientes] = await pool.query(`
      SELECT c.*,
        EXISTS (
          SELECT 1 FROM reserva_habitacion r
          WHERE r.cliente_id = c.cliente_id AND r.estado IN ('reservada', 'checkin') LIMIT 1
        ) AS tieneReservaActiva
      FROM clientes c
    `);
  return clientes.map(cliente => ({
    ...(0, _dateFormatter.formatDatesInObject)(cliente),
    tieneReservaActiva: Boolean(cliente.tieneReservaActiva)
  }));
});
// await pool.end();
exports.getAllClientesWithReservaActiva = getAllClientesWithReservaActiva;