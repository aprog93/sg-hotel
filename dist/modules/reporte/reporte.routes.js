"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _reporteController = require("./reporte.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// /reportes/ingresos?fechaInicio=2024-04-01&fechaFin=2024-04-30
router.get("/ingresos", _reporteController.ingresosPorPeriodo);

// /reportes/tipo-servicio?fechaInicio=2024-04-01&fechaFin=2024-04-30
router.get("/tipo-servicio", _reporteController.reservasPorTipoServicio);

// /reportes/habitacion
router.get("/habitacion", _reporteController.reservasPorHabitacion);

// /reportes/financiero
router.get("/financiero", _reporteController.reporteFinanciero);
var _default = exports.default = router;