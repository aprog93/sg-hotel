"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHabitacion = exports.getHabitaciones = exports.getHabitacionById = void 0;
var Habitacion = _interopRequireWildcard(require("./habitacion.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const getHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.getAllHabitaciones();
    res.json(habitaciones);
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    res.status(500).json({
      error: "Error al obtener habitaciones"
    });
  }
};
exports.getHabitaciones = getHabitaciones;
const getHabitacionById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const habitacion = await Habitacion.getHabitacionById(id);
    if (habitacion) {
      res.json(habitacion);
    } else {
      res.status(404).json({
        message: "Habitación no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al obtener habitación:", error);
    res.status(500).json({
      error: "Error al obtener la habitación"
    });
  }
};
exports.getHabitacionById = getHabitacionById;
const updateHabitacion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await Habitacion.updateHabitacion(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Habitación actualizada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Habitación no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al actualizar habitación:", error);
    res.status(500).json({
      error: "Error al actualizar la habitación"
    });
  }
};
exports.updateHabitacion = updateHabitacion;