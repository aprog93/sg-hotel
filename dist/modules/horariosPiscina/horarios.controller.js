"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHorarioPiscina = exports.getHorariosDisponibles = exports.getHorarioPiscinaById = exports.getAllHorariosPiscina = exports.deleteHorarioPiscina = exports.createHorarioPiscina = exports.checkHorarioDisponibilidad = void 0;
var HorarioPiscina = _interopRequireWildcard(require("./horarios.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/horarioPiscina.controller.js

// Obtener todos los horarios de piscina
const getAllHorariosPiscina = async (req, res) => {
  try {
    const horarios = await HorarioPiscina.getAllHorariosPiscina();
    res.json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios de piscina:", error);
    res.status(500).json({
      error: "Error al obtener horarios de piscina"
    });
  }
};

// Obtener solo horarios disponibles
exports.getAllHorariosPiscina = getAllHorariosPiscina;
const getHorariosDisponibles = async (req, res) => {
  try {
    const horarios = await HorarioPiscina.getHorariosDisponibles();
    res.json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error);
    res.status(500).json({
      error: "Error al obtener horarios disponibles"
    });
  }
};

// Obtener un horario por ID
exports.getHorariosDisponibles = getHorariosDisponibles;
const getHorarioPiscinaById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const horario = await HorarioPiscina.getHorarioPiscinaById(id);
    if (horario) {
      res.json(horario);
    } else {
      res.status(404).json({
        message: "Horario de piscina no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al obtener horario de piscina:", error);
    res.status(500).json({
      error: "Error al obtener el horario de piscina"
    });
  }
};

// Crear un nuevo horario de piscina
exports.getHorarioPiscinaById = getHorarioPiscinaById;
const createHorarioPiscina = async (req, res) => {
  try {
    const horarioData = req.body;
    const horarioId = await HorarioPiscina.createHorarioPiscina(horarioData);
    res.status(201).json({
      id: horarioId,
      message: "Horario de piscina creado exitosamente"
    });
  } catch (error) {
    console.error("Error al crear horario de piscina:", error);
    res.status(500).json({
      error: error.message || "Error al crear el horario de piscina"
    });
  }
};

// Actualizar un horario de piscina
exports.createHorarioPiscina = createHorarioPiscina;
const updateHorarioPiscina = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await HorarioPiscina.updateHorarioPiscina(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Horario de piscina actualizado exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Horario de piscina no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al actualizar horario de piscina:", error);
    res.status(500).json({
      error: "Error al actualizar el horario de piscina"
    });
  }
};

// Eliminar un horario de piscina
exports.updateHorarioPiscina = updateHorarioPiscina;
const deleteHorarioPiscina = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await HorarioPiscina.deleteHorarioPiscina(id);
    if (deleted) {
      res.status(200).json({
        message: "Horario de piscina eliminado exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Horario de piscina no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al eliminar horario de piscina:", error);
    res.status(500).json({
      error: "Error al eliminar el horario de piscina"
    });
  }
};

// Comprobar disponibilidad de horario para una fecha específica
exports.deleteHorarioPiscina = deleteHorarioPiscina;
const checkHorarioDisponibilidad = async (req, res) => {
  try {
    const {
      horarioId,
      fecha
    } = req.query;
    if (!horarioId || !fecha) {
      return res.status(400).json({
        error: "Faltan parámetros requeridos"
      });
    }
    const disponibilidad = await HorarioPiscina.checkHorarioDisponibilidad(horarioId, fecha);
    res.json(disponibilidad);
  } catch (error) {
    console.error("Error al comprobar disponibilidad de horario:", error);
    res.status(500).json({
      error: "Error al comprobar disponibilidad de horario"
    });
  }
};
exports.checkHorarioDisponibilidad = checkHorarioDisponibilidad;