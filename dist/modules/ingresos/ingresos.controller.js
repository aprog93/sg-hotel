"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIngresosFiltrados = exports.getGraficasIngresos = exports.getComparativaInteranual = exports.exportarIngresos = void 0;
var IngresosService = _interopRequireWildcard(require("./ingresos.service.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const getComparativaInteranual = async (req, res) => {
  try {
    const {
      anio
    } = req.query;
    // Validación simple de parámetro 'anio'
    if (!anio || isNaN(Number(anio)) || anio.length !== 4) {
      return res.status(400).json({
        error: "Parámetro 'anio' inválido"
      });
    }
    const data = await IngresosService.comparativaInteranual(Number(anio));
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Error generando comparativa interanual",
      detalle: err.message
    });
  }
};
exports.getComparativaInteranual = getComparativaInteranual;
const getGraficasIngresos = async (req, res) => {
  try {
    const {
      groupBy = "mes",
      desde,
      hasta
    } = req.query;
    if (!["dia", "mes", "anio"].includes(groupBy)) {
      return res.status(400).json({
        error: "Parámetro 'groupBy' inválido"
      });
    }
    const data = await IngresosService.obtenerGraficaIngresos({
      groupBy,
      desde,
      hasta
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Error obteniendo gráficas de ingresos",
      detalle: err.message
    });
  }
};
exports.getGraficasIngresos = getGraficasIngresos;
const getIngresosFiltrados = async (req, res) => {
  try {
    const {
      groupBy = "mes",
      desde,
      hasta
    } = req.query;
    const data = await IngresosService.filtrarIngresos({
      groupBy,
      desde,
      hasta
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Error filtrando ingresos",
      detalle: err.message
    });
  }
};
exports.getIngresosFiltrados = getIngresosFiltrados;
const exportarIngresos = async (req, res) => {
  try {
    const {
      formato = "csv",
      groupBy = "mes",
      desde,
      hasta
    } = req.query;
    const {
      buffer,
      filename
    } = await IngresosService.exportarIngresos({
      formato,
      groupBy,
      desde,
      hasta
    });
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", formato === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({
      error: "Error exportando datos de ingresos",
      detalle: err.message
    });
  }
};
exports.exportarIngresos = exportarIngresos;