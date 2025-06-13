"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSalidas = exports.getLlegadas = exports.getHuespedesActuales = exports.getEstadoHabitaciones = exports.dashboardRecepcion = void 0;
var Recepcion = _interopRequireWildcard(require("./recepcion.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const dashboardRecepcion = async (req, res) => {
  try {
    // Puedes personalizar esto para cargar varios datos a la vez
    const [llegadas, salidas, huespedes, habitaciones] = await Promise.all([Recepcion.getLlegadasHoy(), Recepcion.getSalidasHoy(), Recepcion.getHuespedesActuales(), Recepcion.getEstadoHabitaciones()]);
    res.json({
      llegadas,
      salidas,
      huespedes,
      habitaciones
    });
  } catch (error) {
    console.error("Error en dashboard de recepción:", error);
    res.status(500).json({
      error: "Error al cargar el dashboard de recepción"
    });
  }
};
exports.dashboardRecepcion = dashboardRecepcion;
const getLlegadas = async (req, res) => {
  try {
    const llegadas = await Recepcion.getLlegadasHoy();
    res.json(llegadas);
  } catch (error) {
    console.error("Error al obtener llegadas:", error);
    res.status(500).json({
      error: "Error al obtener llegadas"
    });
  }
};
exports.getLlegadas = getLlegadas;
const getSalidas = async (req, res) => {
  try {
    const salidas = await Recepcion.getSalidasHoy();
    res.json(salidas);
  } catch (error) {
    console.error("Error al obtener salidas:", error);
    res.status(500).json({
      error: "Error al obtener salidas"
    });
  }
};
exports.getSalidas = getSalidas;
const getEstadoHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Recepcion.getEstadoHabitaciones();
    res.json(habitaciones);
  } catch (error) {
    console.error("Error al consultar habitaciones:", error);
    res.status(500).json({
      error: "Error al consultar habitaciones"
    });
  }
};
exports.getEstadoHabitaciones = getEstadoHabitaciones;
const getHuespedesActuales = async (req, res) => {
  try {
    const huespedes = await Recepcion.getHuespedesActuales();
    res.json(huespedes);
  } catch (error) {
    console.error("Error al consultar huéspedes:", error);
    res.status(500).json({
      error: "Error al consultar huéspedes"
    });
  }
};
exports.getHuespedesActuales = getHuespedesActuales;