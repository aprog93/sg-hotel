"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCategoria = exports.getCategoriaById = exports.getAllCategorias = exports.deleteCategoria = exports.createCategoria = void 0;
var CategoriasModel = _interopRequireWildcard(require("../models/categoriasServicio.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/categoriasServicio.controller.js

/**
 * Obtiene todas las categorías de servicios activas
 */
const getAllCategorias = async (req, res) => {
  try {
    const categorias = await CategoriasModel.getAllCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías de servicios:", error);
    res.status(500).json({
      error: "Error al obtener las categorías de servicios"
    });
  }
};

/**
 * Crea una nueva categoría de servicios
 */
exports.getAllCategorias = getAllCategorias;
const createCategoria = async (req, res) => {
  try {
    const categoriaData = req.body;

    // Validación básica
    if (!categoriaData.nombre) {
      return res.status(400).json({
        error: "El nombre de la categoría es obligatorio"
      });
    }
    const categoriaId = await CategoriasModel.createCategoria(categoriaData);
    res.status(201).json({
      id: categoriaId,
      message: "Categoría de servicio creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({
      error: error.message || "Error al crear la categoría de servicio"
    });
  }
};

/**
 * Actualiza una categoría existente
 */
exports.createCategoria = createCategoria;
const updateCategoria = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await CategoriasModel.updateCategoria(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Categoría de servicio actualizada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Categoría de servicio no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({
      error: "Error al actualizar la categoría de servicio"
    });
  }
};

/**
 * Elimina una categoría si no tiene servicios asociados
 */
exports.updateCategoria = updateCategoria;
const deleteCategoria = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await CategoriasModel.deleteCategoria(id);
    if (deleted) {
      res.status(200).json({
        message: "Categoría de servicio eliminada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Categoría de servicio no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error);

    // Si el error es porque tiene servicios asociados, retornamos 400 (Bad Request)
    if (error.message.includes("tiene servicios asociados")) {
      return res.status(400).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: "Error al eliminar la categoría de servicio"
    });
  }
};

/**
 * Obtiene una categoría por su ID
 */
exports.deleteCategoria = deleteCategoria;
const getCategoriaById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const categoria = await CategoriasModel.getCategoriaById(id);
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({
        message: "Categoría de servicio no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({
      error: "Error al obtener la categoría de servicio"
    });
  }
};
exports.getCategoriaById = getCategoriaById;