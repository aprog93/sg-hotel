"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _estadisticasController = require("./estadisticas.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/estadisticas.routes.js

const router = _express.default.Router();

// Ocupación de las habitaciones por estado
router.get("/habitaciones/ocupacion", _estadisticasController.getOcupacionHabitaciones);

// Ingresos y cantidad de reservas de habitaciones (puedes pasar ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD)
router.get("/habitaciones/ingresos", _estadisticasController.getIngresosHabitaciones);

// Nuevos clientes en período
router.get("/clientes/nuevos", _estadisticasController.getNuevosClientes);

// Estado de reservas por módulo: habitacion, restaurante, piscina, servicio
// Ejemplo: /api/estadisticas/reservas/estado/reserva_habitacion
router.get("/reservas/estado/:tabla", _estadisticasController.getReservasPorEstado);

// Tickets de atención por estado
router.get("/tickets/estados", _estadisticasController.getTicketsPorEstado);

// Uso y aforo de piscina por horario (puedes pasar ?fecha=YYYY-MM-DD)
router.get("/piscina/uso-por-horario", _estadisticasController.getUsoPiscinaPorHorario);

// Nuevo endpoint resumen para dashboards
router.get("/resumen", _estadisticasController.getResumenEstadisticas);
var _default = exports.default = router;