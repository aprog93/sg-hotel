"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reservasPorTipoServicio = exports.reservasPorHabitacion = exports.reporteFinanciero = exports.ingresosPorPeriodo = void 0;
var Reporte = _interopRequireWildcard(require("./reporte.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Ingresos en un periodo
const ingresosPorPeriodo = async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin
    } = req.query;
    const data = await Reporte.getIngresosPorPeriodo(fechaInicio, fechaFin);
    res.json(data);
  } catch (error) {
    console.error("Error en reporte de ingresos:", error);
    res.status(500).json({
      error: "Error al obtener ingresos por periodo"
    });
  }
};

// Reservas por tipo de servicio en un periodo
exports.ingresosPorPeriodo = ingresosPorPeriodo;
const reservasPorTipoServicio = async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin
    } = req.query;
    const data = await Reporte.getReservasPorTipoServicio(fechaInicio, fechaFin);
    res.json(data);
  } catch (error) {
    console.error("Error en reporte reservas por tipo de servicio:", error);
    res.status(500).json({
      error: "Error al obtener reservas por tipo de servicio"
    });
  }
};

// Reservas por habitación
exports.reservasPorTipoServicio = reservasPorTipoServicio;
const reservasPorHabitacion = async (req, res) => {
  try {
    const data = await Reporte.getReservasPorHabitacion();
    res.json(data);
  } catch (error) {
    console.error("Error en reporte reservas por habitación:", error);
    res.status(500).json({
      error: "Error al obtener reservas por habitación"
    });
  }
};

// Reporte financiero
exports.reservasPorHabitacion = reservasPorHabitacion;
const reporteFinanciero = async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin
    } = req.query;
    const ingresosHabitaciones = await Reporte.getIngresosHabitaciones(fechaInicio, fechaFin);
    const ingresosServicios = await Reporte.getIngresosServicios(fechaInicio, fechaFin);
    const ingresosPiscina = await Reporte.getIngresosPiscina(fechaInicio, fechaFin);
    const totalHabitaciones = await Reporte.getTotalHabitaciones();
    const nochesOcupadas = await Reporte.getNochesOcupadas(fechaInicio, fechaFin);

    // Asegura conversión a número para sumas y cálculos
    const habitaciones = Number(ingresosHabitaciones) || 0;
    const servicios = Number(ingresosServicios) || 0;
    const piscina = Number(ingresosPiscina) || 0;
    const total = habitaciones + servicios + piscina;

    // Indicadores
    const diasPeriodo = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
    const habitacionesPeriodo = totalHabitaciones * diasPeriodo;
    const tasaOcupacion = habitacionesPeriodo > 0 ? (nochesOcupadas / habitacionesPeriodo * 100).toFixed(2) : 0;
    const adr = nochesOcupadas > 0 ? (habitaciones / nochesOcupadas).toFixed(2) : 0;
    const revpar = habitacionesPeriodo > 0 ? (habitaciones / habitacionesPeriodo).toFixed(2) : 0;
    res.json({
      periodo: {
        fechaInicio,
        fechaFin
      },
      ingresos: {
        habitaciones: habitaciones.toFixed(2),
        servicios: servicios.toFixed(2),
        piscina: piscina.toFixed(2),
        total: total.toFixed(2)
      },
      indicadores: {
        tasaOcupacion,
        ADR: adr,
        RevPAR: revpar
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener reporte financiero",
      details: err.message
    });
  }
};
exports.reporteFinanciero = reporteFinanciero;