"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _recepcionController = require("./recepcion.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/dashboard", _recepcionController.dashboardRecepcion); // Panel general de la recepción
router.get("/llegadas", _recepcionController.getLlegadas); // Llegadas del día
router.get("/salidas", _recepcionController.getSalidas); // Salidas del día
router.get("/habitaciones", _recepcionController.getEstadoHabitaciones); // Estado de habitaciones
router.get("/huespedes", _recepcionController.getHuespedesActuales); // Huéspedes alojados actualmente
var _default = exports.default = router;