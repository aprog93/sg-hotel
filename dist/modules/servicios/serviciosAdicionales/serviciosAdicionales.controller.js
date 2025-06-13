"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateServicio = exports.getServiciosByCategoria = exports.getServicioById = exports.getDisponibilidadServicio = exports.getAllServicios = exports.deleteServicio = exports.createServicio = void 0;
var ServiciosModel = _interopRequireWildcard(require("./serviciosAdicionales.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/serviciosAdicionales.controller.js

// Operaciones CRUD básicas para servicios
const getAllServicios = async (req, res) => {
  try {
    const servicios = await ServiciosModel.getAllServicios();
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({
      error: "Error al obtener servicios adicionales"
    });
  }
};
exports.getAllServicios = getAllServicios;
const getServicioById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const servicio = await ServiciosModel.getServicioById(id);
    if (servicio) {
      res.json(servicio);
    } else {
      res.status(404).json({
        message: "Servicio no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al obtener servicio:", error);
    res.status(500).json({
      error: "Error al obtener el servicio"
    });
  }
};
exports.getServicioById = getServicioById;
const createServicio = async (req, res) => {
  try {
    const servicioData = req.body;

    // Validaciones básicas
    if (!servicioData.nombre || !servicioData.precio) {
      return res.status(400).json({
        error: "Nombre y precio son campos obligatorios"
      });
    }
    const servicioId = await ServiciosModel.createServicio(servicioData);
    res.status(201).json({
      id: servicioId,
      message: "Servicio adicional creado exitosamente"
    });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({
      error: error.message || "Error al crear el servicio adicional"
    });
  }
};
exports.createServicio = createServicio;
const updateServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await ServiciosModel.updateServicio(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Servicio adicional actualizado exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Servicio adicional no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({
      error: "Error al actualizar el servicio adicional"
    });
  }
};
exports.updateServicio = updateServicio;
const deleteServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await ServiciosModel.deleteServicio(id);
    if (deleted) {
      res.status(200).json({
        message: "Servicio adicional eliminado exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Servicio adicional no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({
      error: "Error al eliminar el servicio adicional"
    });
  }
};

// Operaciones específicas relacionadas con servicios
exports.deleteServicio = deleteServicio;
const getServiciosByCategoria = async (req, res) => {
  try {
    const {
      categoriaId
    } = req.params;
    const servicios = await ServiciosModel.getServiciosByCategoria(categoriaId);
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios por categoría:", error);
    res.status(500).json({
      error: "Error al obtener servicios por categoría"
    });
  }
};
exports.getServiciosByCategoria = getServiciosByCategoria;
const getDisponibilidadServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      fecha
    } = req.query;
    if (!fecha) {
      return res.status(400).json({
        error: "La fecha es obligatoria"
      });
    }
    const disponibilidad = await ServiciosModel.getDisponibilidadServicio(id, fecha);
    res.json(disponibilidad);
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    res.status(500).json({
      error: "Error al obtener disponibilidad del servicio"
    });
  }
};
exports.getDisponibilidadServicio = getDisponibilidadServicio;