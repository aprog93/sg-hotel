"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsoPiscinaPorHorario = exports.getTicketsPorEstado = exports.getResumenEstadisticas = exports.getReservasPorEstado = exports.getOcupacionHabitaciones = exports.getNuevosClientes = exports.getIngresosHabitaciones = void 0;
var Estadisticas = _interopRequireWildcard(require("./estadisticas.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Helper para respuestas estándar y logs opcionales
function sendResponse(res, data, errorMsg, status = 500) {
  if (data) return res.json(data);
  return res.status(status).json({
    error: errorMsg
  });
}

/**
 * Endpoint resumen de KPIs principales para dashboard
 * GET /api/estadisticas/resumen?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 */
const getResumenEstadisticas = async (req, res) => {
  try {
    const {
      desde,
      hasta
    } = req.query;

    // Haz los queries en paralelo para mayor eficiencia
    const [ingresosData, ocupacionData, nuevosClientesData] = await Promise.all([Estadisticas.ingresosHabitaciones({
      desde,
      hasta
    }), Estadisticas.habitacionesOcupacion(), Estadisticas.nuevosClientes({
      desde,
      hasta
    })]);

    // Normaliza la ocupación a porcentaje si tus datos lo permiten
    const habitacionesTotales = ocupacionData.reduce((acc, h) => acc + h.cantidad, 0);
    const habitacionesOcupadas = ocupacionData.find(h => h.estado === "ocupada")?.cantidad || 0;
    const ocupacion = habitacionesTotales ? `${Math.round(habitacionesOcupadas / habitacionesTotales * 100)}%` : "0%";
    res.json({
      ingresos: ingresosData[0]?.totalIngresos || 0,
      reservas: ingresosData[0]?.totalReservas || 0,
      clientes: nuevosClientesData[0]?.nuevosClientes || 0,
      ocupacion,
      detalleOcupacion: ocupacionData
    });
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo resumen de estadísticas",
      detalle: error.message
    });
  }
};
exports.getResumenEstadisticas = getResumenEstadisticas;
const getOcupacionHabitaciones = async (req, res) => {
  try {
    const data = await Estadisticas.habitacionesOcupacion();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo estadística de habitaciones"
    });
  }
};
exports.getOcupacionHabitaciones = getOcupacionHabitaciones;
const getIngresosHabitaciones = async (req, res) => {
  try {
    const {
      desde,
      hasta
    } = req.query;
    const data = await Estadisticas.ingresosHabitaciones({
      desde,
      hasta
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo ingresos"
    });
  }
};
exports.getIngresosHabitaciones = getIngresosHabitaciones;
const getNuevosClientes = async (req, res) => {
  try {
    const {
      desde,
      hasta
    } = req.query;
    const data = await Estadisticas.nuevosClientes({
      desde,
      hasta
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo nuevos clientes"
    });
  }
};
exports.getNuevosClientes = getNuevosClientes;
const getReservasPorEstado = async (req, res) => {
  try {
    const {
      tabla
    } = req.params;
    const data = await Estadisticas.reservasPorEstado(tabla);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Error obteniendo reservas por estado"
    });
  }
};
exports.getReservasPorEstado = getReservasPorEstado;
const getTicketsPorEstado = async (req, res) => {
  try {
    const data = await Estadisticas.ticketsPorEstado();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo estadísticas de tickets"
    });
  }
};
exports.getTicketsPorEstado = getTicketsPorEstado;
const getUsoPiscinaPorHorario = async (req, res) => {
  try {
    const {
      fecha
    } = req.query;
    const data = await Estadisticas.usoPiscinaPorHorario({
      fecha
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo uso de piscina"
    });
  }
};
exports.getUsoPiscinaPorHorario = getUsoPiscinaPorHorario;