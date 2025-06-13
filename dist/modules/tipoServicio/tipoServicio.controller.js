"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTipoServicio = exports.getTiposServicio = exports.getTipoServicioById = exports.deleteTipoServicio = exports.createTipoServicio = void 0;
var TipoServicio = _interopRequireWildcard(require("./tipoServicio.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const getTiposServicio = async (req, res) => {
  try {
    const tipos = await TipoServicio.getAllTiposServicio();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de servicio:", error);
    res.status(500).json({
      error: "Error al obtener los tipos de servicio"
    });
  }
};
exports.getTiposServicio = getTiposServicio;
const getTipoServicioById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const tipo = await TipoServicio.getTipoServicioById(id);
    if (tipo) {
      res.json(tipo);
    } else {
      res.status(404).json({
        message: "Tipo de servicio no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al obtener tipo de servicio:", error);
    res.status(500).json({
      error: "Error al obtener el tipo de servicio"
    });
  }
};
exports.getTipoServicioById = getTipoServicioById;
const createTipoServicio = async (req, res) => {
  try {
    const tipoServicioData = req.body;
    const tipoServicioId = await TipoServicio.createTipoServicio(tipoServicioData);
    res.status(201).json({
      id: tipoServicioId,
      message: "Tipo de servicio creado exitosamente"
    });
  } catch (error) {
    console.error("Error al crear tipo de servicio:", error);
    res.status(500).json({
      error: "Error al crear el tipo de servicio"
    });
  }
};
exports.createTipoServicio = createTipoServicio;
const updateTipoServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await TipoServicio.updateTipoServicio(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Tipo de servicio actualizado exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Tipo de servicio no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al actualizar tipo de servicio:", error);
    res.status(500).json({
      error: "Error al actualizar el tipo de servicio"
    });
  }
};
exports.updateTipoServicio = updateTipoServicio;
const deleteTipoServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await TipoServicio.deleteTipoServicio(id);
    if (deleted) {
      res.status(200).json({
        message: "Tipo de servicio eliminado exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Tipo de servicio no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al eliminar tipo de servicio:", error);
    res.status(500).json({
      error: "Error al eliminar el tipo de servicio"
    });
  }
};
exports.deleteTipoServicio = deleteTipoServicio;