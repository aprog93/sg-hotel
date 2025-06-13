"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCategoria = exports.getCategoriaById = exports.getAllCategorias = exports.deleteCategoria = exports.createCategoria = void 0;
var _mysql = require("../../../config/mysql.js");
var _dateFormatter = require("../../../utils/dateFormatter.js");
// models/categoriasServicio.model.js

// Obtener categorías de servicios
const getAllCategorias = async () => {
  const [rows] = await _mysql.pool.query(`
        SELECT * FROM categorias_servicio
        WHERE estado = 'activo'
        ORDER BY nombre
    `);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Crear una categoría
exports.getAllCategorias = getAllCategorias;
const createCategoria = async categoriaData => {
  const [result] = await _mysql.pool.query(`INSERT INTO categorias_servicio SET ?`, [categoriaData]);
  return result.insertId;
};

// Actualizar categoría
exports.createCategoria = createCategoria;
const updateCategoria = async (id, categoriaData) => {
  const [result] = await _mysql.pool.query(`UPDATE categorias_servicio SET ? WHERE categoria_id = ?`, [categoriaData, id]);
  return result.affectedRows > 0;
};

// Eliminar categoría (solo si no tiene servicios asociados)
exports.updateCategoria = updateCategoria;
const deleteCategoria = async id => {
  // Primero verificamos que no tenga servicios
  const [servicios] = await _mysql.pool.query(`SELECT COUNT(*) as count FROM servicios_adicionales WHERE categoria_id = ?`, [id]);
  if (servicios[0].count > 0) {
    throw new Error("No se puede eliminar la categoría porque tiene servicios asociados");
  }
  const [result] = await _mysql.pool.query(`DELETE FROM categorias_servicio WHERE categoria_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Obtener categoría por ID
exports.deleteCategoria = deleteCategoria;
const getCategoriaById = async id => {
  const [rows] = await _mysql.pool.query(`SELECT * FROM categorias_servicio WHERE categoria_id = ?`, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};
exports.getCategoriaById = getCategoriaById;