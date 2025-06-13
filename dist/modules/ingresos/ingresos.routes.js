"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var IngresosController = _interopRequireWildcard(require("./ingresos.controller.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const router = (0, _express.Router)();
router.get("/graficas", IngresosController.getGraficasIngresos);
router.get("/filtrar", IngresosController.getIngresosFiltrados);
router.get("/comparativa-interanual", IngresosController.getComparativaInteranual);
router.get("/exportar", IngresosController.exportarIngresos);
var _default = exports.default = router;