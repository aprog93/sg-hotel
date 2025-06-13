"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _reservaServicioController = require("./reservaServicio.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/reservasServicios.routes.js

const router = _express.default.Router();

// Operaciones CRUD para reservas
router.get("/", _reservaServicioController.getAllReservasServicio);
router.get("/cliente/:clienteId", _reservaServicioController.getReservasByCliente);
router.post("/", _reservaServicioController.createReservaServicio);
router.put("/:id/cancelar", _reservaServicioController.cancelarReservaServicio);
var _default = exports.default = router;