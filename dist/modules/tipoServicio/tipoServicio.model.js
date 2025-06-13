"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTipoServicio = exports.getTipoServicioById = exports.getAllTiposServicio = exports.deleteTipoServicio = exports.createTipoServicio = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
const getAllTiposServicio = async () => {
  const connection = await (0, _mysql.connectDB)();
  const [results] = await connection.query(`
    SELECT tipo_servicio_id, nombre, descripcion
    FROM tipos_servicio
  `);
  await connection.end();
  return results.map(_dateFormatter.formatDatesInObject);
};
exports.getAllTiposServicio = getAllTiposServicio;
const getTipoServicioById = async id => {
  const connection = await (0, _mysql.connectDB)();
  const [rows] = await connection.query(`SELECT tipo_servicio_id, nombre, descripcion
     FROM tipos_servicio
     WHERE tipo_servicio_id = ?`, [id]);
  await connection.end();
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows) : null;
};
exports.getTipoServicioById = getTipoServicioById;
const createTipoServicio = async tipoServicioData => {
  const connection = await (0, _mysql.connectDB)();
  const [result] = await connection.query(`INSERT INTO tipos_servicio SET ?`, [tipoServicioData]);
  await connection.end();
  return result.insertId;
};
exports.createTipoServicio = createTipoServicio;
const updateTipoServicio = async (id, tipoServicioData) => {
  const connection = await (0, _mysql.connectDB)();
  const [result] = await connection.query(`UPDATE tipos_servicio SET ? WHERE tipo_servicio_id = ?`, [tipoServicioData, id]);
  await connection.end();
  return result.affectedRows > 0;
};
exports.updateTipoServicio = updateTipoServicio;
const deleteTipoServicio = async id => {
  const connection = await (0, _mysql.connectDB)();
  const [result] = await connection.query(`DELETE FROM tipos_servicio WHERE tipo_servicio_id = ?`, [id]);
  await connection.end();
  return result.affectedRows > 0;
};
exports.deleteTipoServicio = deleteTipoServicio;