"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.obtenerGraficaIngresos = exports.filtrarIngresos = exports.exportarIngresos = exports.comparativaInteranual = void 0;
var ingresosModel = _interopRequireWildcard(require("./ingresos.model.js"));
var _json2csv = require("json2csv");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// ingresos.service.js

/**
 * Obtiene los ingresos agrupados para gráficas, usando el modelo.
 */
const obtenerGraficaIngresos = async params => {
  // Puedes agregar lógica extra aquí si lo necesitas.
  return await ingresosModel.obtenerIngresosPorPeriodo(params);
};
exports.obtenerGraficaIngresos = obtenerGraficaIngresos;
const filtrarIngresos = exports.filtrarIngresos = obtenerGraficaIngresos;

/**
 * Devuelve array comparando ingresos mes a mes contra el año anterior.
 */
const comparativaInteranual = async anio => {
  const [actual, pasada] = await Promise.all([ingresosModel.obtenerIngresosPorPeriodo({
    groupBy: "mes",
    desde: `${anio}-01-01`,
    hasta: `${anio}-12-31`
  }), ingresosModel.obtenerIngresosPorPeriodo({
    groupBy: "mes",
    desde: `${anio - 1}-01-01`,
    hasta: `${anio - 1}-12-31`
  })]);
  const meses = Array.from({
    length: 12
  }, (_, i) => String(i + 1).padStart(2, "0"));
  const actualMap = Object.fromEntries(actual.map(m => [m.periodo.slice(5, 7), m.totalIngresos ?? 0]));
  const pasadaMap = Object.fromEntries(pasada.map(m => [m.periodo.slice(5, 7), m.totalIngresos ?? 0]));
  return meses.map(mes => ({
    mes,
    ingresosActual: Number(actualMap[mes] || 0),
    ingresosAnterior: Number(pasadaMap[mes] || 0),
    variacion: Number(actualMap[mes] || 0) - Number(pasadaMap[mes] || 0),
    variacionPorcentual: pasadaMap[mes] && pasadaMap[mes] !== 0 ? (Number(actualMap[mes] || 0) - Number(pasadaMap[mes])) / Number(pasadaMap[mes]) * 100 : null
  }));
};

/**
 * Prepara la exportación de ingresos en formato CSV.
 * Extrae la data usando el modelo y la transforma a buffer para descarga.
 */
exports.comparativaInteranual = comparativaInteranual;
const exportarIngresos = async ({
  formato = "csv",
  ...params
}) => {
  const data = await ingresosModel.obtenerIngresosPorPeriodo(params);
  if (formato === "csv") {
    const parser = new _json2csv.Parser({
      fields: ["periodo", "totalIngresos"]
    });
    const csv = parser.parse(data);
    return {
      buffer: Buffer.from(csv, "utf8"),
      filename: `ingresos_${params.desde || "inicio"}_${params.hasta || "fin"}.csv`
    };
  }
  throw new Error("Formato de exportación no soportado");
};
exports.exportarIngresos = exportarIngresos;